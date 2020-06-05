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


import React from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import { Table } from "apache-arrow";

function FileSelector(props) {
   const defaultValue = ""
   const [value, setValue] = React.useState(defaultValue);

   function load() {
     fetch(value).then(resp => {
      return resp.arrayBuffer().then(data => {
        const arr = new Uint8Array(data)

        let d = Table.from(data)

         props.setData(d, arr)
       })
     })
   }
   
   return (
     <InputGroup className={props.className}>
       <InputGroup.Append>
         <Form.Control onChange={ e => setValue(e.target.value)}  value={value} />
         <Button onClick={load}>loadFile</Button>
       </InputGroup.Append>
     </InputGroup>
   );
}


export default FileSelector;
