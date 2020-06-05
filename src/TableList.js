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

import TableWidget from './TableWidget'

export default function TableList(props) {
    const layout = [
      [props.data.schema.fields[0].name, props.data.schema.fields[1].name],
      [props.data.schema.fields[0].name, props.data.schema.fields[2].name]
    ]

  return layout.map(columns => {
    return <TableWidget key={columns} data={props.data} columns={columns} serial={props.serial} wasm={props.wasm} filters={props.filters} sortBy={props.sortBy}/>
  }) 
}
 
