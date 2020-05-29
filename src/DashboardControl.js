import React from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Col from 'react-bootstrap/Col';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import SelectionDropdown from './SelectionDropdown'
import FileSelector from './FileSelector'

import { DataType, Table, Utf8Vector, FloatVector, predicate } from "apache-arrow";

function DashboardControl(props) {
  const filterType = ["<", ">", "=="];

  const [column, setColumn] = React.useState(props.schema.fields[0].name);
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
    <Navbar bg="light">
      <FileSelector setData={props.setData}/>
      <InputGroup className="xs-6">
        <InputGroup.Prepend>
          <SelectionDropdown selectionList={ props.schema.fields.filter(field => DataType.isInt(field.type) || DataType.isFloat(field.type) || DataType.isDecimal(field.type)).map(field => field.name) } onSelect={setColumn}/>
          <SelectionDropdown selectionList={filterType} onSelect={setFilterToApply} /> 
        </InputGroup.Prepend>
        <Form.Control onChange={(e) => setFilterValue(e.target.value)} value={filterValue}/>
        <InputGroup.Append>
          <Button onClick={addFilter}> Add Filter </Button>
        </InputGroup.Append>
      </InputGroup>
      <InputGroup>
      <label>SortBy</label>
      <SelectionDropdown selectionList={ props.schema.fields.filter(field => DataType.isInt(field.type) || DataType.isFloat(field.type) || DataType.isDecimal(field.type)).map(field => field.name) } onSelect={props.setSortBy}/>
      </InputGroup>
    </Navbar>
  );
}

export default DashboardControl;
