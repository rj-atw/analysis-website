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

#[wasm_bindgen]
pub fn readme() -> String { 
  return String::from("Calculates the variance")
}

fn limit_sorted_filter_propagate_error(
  a: &[u8], f: &[u8], idx: u32, limit: u32, out_slice: & mut [u8]) 
-> Result<(), arrow::error::ArrowError> { 
   let mut reader = arrow::ipc::reader::StreamReader::try_new(a)?;


  //TODO: handle None case i.e. an empty batch
  let batch = match reader.next()? {
    Some(x) => Ok(x),
    None => Err(arrow::error::ArrowError::ParseError(String::from("Arrow serial data contained no data")))
  }?;
  

  let arr = arrow::compute::kernels::sort::sort_to_indices(
    &batch.column(idx as usize),
    Some(arrow::compute::kernels::sort::SortOptions{ 
      descending: true, 
      nulls_first: true
    })
  )?;


  let mut output_index = 0;
  let mut builder = arrow::array::PrimitiveBuilder::<arrow::datatypes::UInt32Type>::new(f.len());
  let mut iter = arr. value_slice(0, arr.len()).iter();
  while output_index < limit {
    match iter.next() {
      Some(idx) => {
        if f[*idx as usize] > 0 {
          builder.append_value(*idx)?;
          output_index += 1;
        }
      }
      None => {
        break;
      }
    }
  }

  let v = builder.finish();

  let rb = arrow::record_batch::RecordBatch::try_new( 
    std::sync::Arc::new(arrow::datatypes::Schema::new(vec![
      arrow::datatypes::Field::new("result", arrow::datatypes::DataType::UInt32, false)
    ])),
    vec![std::sync::Arc::new(v)]
   )?;


   let mut writer = arrow::ipc::writer::StreamWriter::try_new(
    out_slice,
    &(arrow::datatypes::Schema::new(vec![
      arrow::datatypes::Field::new("result", arrow::datatypes::DataType::UInt32, false)
    ]))
   )?;

   writer.write(&rb)?;

   writer.finish()?;
     

  Ok(())
}
 
/*
  Has 20 byte of error message by convention
*/
#[wasm_bindgen]
pub fn limit_sorted_filter(a: &[u8], f: &[u8], idx: u32, limit: u32, out: *mut u8, size: u32, err: *mut u8) 
-> *const u8 { 
  let out_slice = unsafe { std::slice::from_raw_parts_mut(out, size as usize) };

  let rtn = limit_sorted_filter_propagate_error(a,f,idx,limit,out_slice);

  match rtn {
    Ok(_) => {
      out
    }
    Err(e) => {
      unsafe {
        let bytes_to_copy = std::cmp::max(e.to_string().as_bytes().len(), 200);
        std::ptr::copy_nonoverlapping(e.to_string().as_bytes().as_ptr(), err, bytes_to_copy);
      }
      0 as *const u8
    }
  }
}
