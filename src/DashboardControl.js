import React from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Col from 'react-bootstrap/Col';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import SchemaDropdown from './SchemaDropdown'
import SelectionDropdown from './SelectionDropdown'

import { Table, Utf8Vector, FloatVector, predicate } from "apache-arrow";

         // <SchemaDropdown schema={props.schema} onSelect={setFoo}/> 
function DashboardControl(props) {
  const filterType = ["<", ">", "=="];

  const [column, setColumn] = React.useState(0);
  const [filterToApply, setFilterToApply] = React.useState(filterType[0]);
  const [filterValue, setFilterValue] = React.useState(0);
  const [filters, setFilters] = React.useState("");
  const predicates = []

  function addFilter(e) {
    if("<" == filterToApply) {
      predicates.push(predicate.col(column).lt(filterValue));
    } else if ( ">" == filterToApply) {
      predicates.push(predicate.col(column).gt(filterValue));
    } else if ( "==" == filterToApply) {
      predicates.push(predicate.col(column).eq(filterValue));
    }

    props.propagateSelectedFilter(predicates)
    
    setFilters(filters.concat(column + " " + filterToApply + " " + filterValue + "; "))
  }

  return (
   <div>
    <Navbar bg="light">
      <InputGroup className="xs-6">
        <InputGroup.Prepend>
          <SelectionDropdown selectionList={ props.schema.fields.map(field => field.name) } onSelect={setColumn}/>
          <SelectionDropdown selectionList={filterType} onSelect={setFilterToApply} /> 
        </InputGroup.Prepend>
        <Form.Control onChange={(e) => setFilterValue(e.target.value)} value={filterValue}/>
        <InputGroup.Append>
          <Button onClick={addFilter}> Add Filter </Button>
        </InputGroup.Append>
      </InputGroup>
    </Navbar>
      Filters = {filters}
    </div>
  );
}

export default DashboardControl;
