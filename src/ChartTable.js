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


import React from 'react';

import Table from 'react-bootstrap/Table';

import {predicate} from "apache-arrow";

import { sort } from "./wasm_interopt";


function createFilterVector(table, filter) {
  if(!filter) {
    return new Uint8Array(table.count()).fill(1)
  }

  let p = null;

	let values1 = new Uint8Array(table.count());
			
	table.scan( (idx, columns) => {
    if(p(idx, columns)) {
		  values1.set([1], idx);
    } else {
		  values1.set([0], idx);
    }
	}, (batch) => {
		 p= filter.bind(batch);
	}); 

  return values1
}

function nullSafe(obj, dft) {
  if (obj == null) return dft
  else return obj
}

function formatForDisplay(value) {
  //Find cleaner method to handle 
  if(typeof value == 'object') {
    //ToDo handle high bit
    return value[0]
  } else {
    return value
  }
}

function LimitRows(props) {
  const idx = props.data.getColumnIndex(props.sortBy)

  const sortRowIdx = sort(props.wasm, props.serial, createFilterVector(props.data, props.filters), idx, 10)

  let values1 = []
  let values2 = []
  let column1 = props.data.getColumn(props.column[0])
  let column2 = props.data.getColumn(props.column[1])
  sortRowIdx.forEach((i,idx) => {
     values1.push( nullSafe(column1.get(i), 'null') )
     values2.push( nullSafe(column2.get(i), 'null') )
  })

  return Array.from({length: 10}, (x,i) => <tr key={i}><td>{values1[i]}</td><td>{formatForDisplay(values2[i])}</td></tr>)
}


function ChartTable(props) {

  return (
    <Table striped bordered size="sm" responsive>
      <thead>
        <tr>
          <th>{props.columns[0]}</th>
          <th>{props.columns[1]}</th>
        </tr>
      </thead>

      <tbody>
        <LimitRows limit={10} column={props.columns} data={props.data} serial={props.serial} wasm={props.wasm} filters={props.filters} sortBy={props.sortBy}/>
      </tbody>
    </Table>
  )
}

export default ChartTable
