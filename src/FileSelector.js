import React from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import { Table } from "apache-arrow";

function FileSelector(props) {
   const defaultValue = ""
   const [value, setValue] = React.useState(defaultValue);

   function load() {
     Table.from(fetch(value)).then(table =>
       props.setData(table)
     )
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
