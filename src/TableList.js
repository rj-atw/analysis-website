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
 
