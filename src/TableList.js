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

import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

function TList(props) {

  return props.layout.map(columns => {
    return <TableWidget key={columns} data={props.data} columns={columns} serial={props.serial} wasm={props.wasm} filters={props.filters} sortBy={props.sortBy}/>
    })
}

export default function TableList(props) {
    const defaultLayout = [
      [props.data.schema.fields[0].name, props.data.schema.fields[1].name],
      [props.data.schema.fields[0].name, props.data.schema.fields[2].name]
    ]

    const [layout, setLayout] = React.useState(defaultLayout)
    const newColumnInput = React.createRef()

    const onClick = e => {
      let newLayout = layout.map(x=>x)
      newLayout.push(newColumnInput.current.value.split(','))
      setLayout(newLayout)
    }

    return (
    <div>
      <Row>
         <Form>
           <Form.Label>New Chart's Column Name</Form.Label>
           <Form.Control ref={newColumnInput}/>
           <Button variant="primary" onClick={onClick}>Add Chart</Button>
         </Form>
      </Row>
      <Row xs={1} md={1} lg={2}>
        <TList data={props.data} layout={layout} serial={props.serial} wasm={props.wasm} filters={props.filters} sortBy={props.sortBy}/>
      </Row>
    </div>
    )
}
 
