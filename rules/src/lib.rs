//
// This file and its contents are supplied under the terms of the
// Common Development and Distribution License ("CDDL"), version 1.0.
// You may only use this file in accordance with the terms of version
// 1.0 of the CDDL.
//
// A full copy of the text of the CDDL should have accompanied this
// source.  A copy of the CDDL is also available via the Internet at
// https://opensource.org/licenses/CDDL-1.0
//


use wasm_bindgen::prelude::*;

use arrow::record_batch::RecordBatch;
use std::io::Write;
use arrow::array::*;
use arrow::error::ArrowError;
use datafusion::execution::context::ExecutionContext;
use datafusion::error::ExecutionError;
use datafusion::logicalplan::{aggregate_expr, col};

#[wasm_bindgen]
pub fn readme() -> String { 
  return String::from("Returns the ratio of republician vs democratic speeches")
}

#[wasm_bindgen]
pub fn rule_name() -> String {
  return String::from("ratio_of_speeches")
}

/* General compute wrapper function over arrow input. Writes result into 
   out_buffer passed to it or writes error into out_buffer. Returns true
   if compution was succesful, i.e. out_buffer contains a serialized arrow
   result, otherwise it returns false and writes error string to the result
*/
#[wasm_bindgen]
pub fn compute(
  serialized_arrow: &[u8], 
  out_buffer: *mut u8, 
  out_buffer_size: u32 
) -> bool {
  
  match get_record_batch(serialized_arrow).and_then( |batch| {
    get_speech_ratio(batch)
  }).and_then( |output_table| {
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out_buffer, out_buffer_size as usize) };
    write_batch_to_buffer(&output_table, out_slice)
  }) { 
    Ok(_) => {
      true
    }
    Err(e) => {
      let mut out_slice = unsafe { std::slice::from_raw_parts_mut(out_buffer, out_buffer_size as usize) };
      write!(out_slice, "{:?}", e).unwrap(); /* Panic as we are in the error handling branch */
      false
    }
  }
}

fn write_batch_to_buffer(batches: &Vec<RecordBatch>, out_slice: & mut[u8]) -> Result<(), ExecutionError> {
   let rb = batches.get(0).ok_or_else(|| ExecutionError::ExecutionError(String::from("no data")))?;
   let mut writer = arrow::ipc::writer::StreamWriter::try_new(
    out_slice,
    &rb.schema()
   )?;

   writer.write(rb)?;

   writer.finish()?;

   Ok(())
}

fn get_record_batch(serialized_arrow: &[u8]) -> Result<RecordBatch, ExecutionError> {
  let mut reader = arrow::ipc::reader::StreamReader::try_new(serialized_arrow)?;

  match reader.next()? {
    Some(batch) => Ok(batch),
    None => Err(ExecutionError::ArrowError(ArrowError::ParseError(String::from("Arrow serial data contained no data"))))
  }
}

fn get_speech_ratio(batch: RecordBatch, ) -> Result<Vec<RecordBatch>, ExecutionError> {

/*
    let mut ctx = ExecutionContext::new();

    let provider = datafusion::datasource::memory::MemTable::new(batch.schema().clone(), vec![vec![batch]])?;

    ctx.register_table("t", Box::new(provider));

    let t = ctx.table("t")?;

    let t = t.aggregate(vec![col("category")], 
      vec![
        aggregate_expr("sum", col("r_speeches"), arrow::datatypes::DataType::Int64).alias("speech_ratio")
    ])?;

    t.collect(&mut ctx, 10)
*/
/*
    let sql = "SELECT category, sum(d_speeches)*sum(r_speeches) as speech_ratio FROM t group by category";

    // create the query plan
    let plan = ctx.create_logical_plan(sql)?;
    let plan = ctx.optimize(&plan)?;
    let plan = ctx.create_physical_plan(&plan, 1024*1024)?;
  


    ctx.collect(plan.as_ref()) 
  */  

    let d = batch.schema().index_of("d_speeches")?;
    let r = batch.schema().index_of("r_speeches")?;

    let d_speeches = batch.column(d).as_any().downcast_ref::<Int64Array>()
          .ok_or(arrow::error::ArrowError::IoError(String::from("d_speeches is not the correct type")))?;
    let r_speeches = batch.column(r).as_any().downcast_ref::<Int64Array>()
          .ok_or(arrow::error::ArrowError::IoError(String::from("r_speeches is not the correct type")))?;

    let speech_ratio = arrow::compute::multiply(d_speeches, r_speeches)?;

    arrow::record_batch::RecordBatch::try_new( 
      std::sync::Arc::new(arrow::datatypes::Schema::new(vec![
        arrow::datatypes::Field::new("speech_ratio", arrow::datatypes::DataType::Int64, false)
      ])),
      vec![std::sync::Arc::new(speech_ratio)]
    ).and_then(|rb| Ok(vec![rb])).map_err(|e| ExecutionError::ArrowError(e))
    
}
