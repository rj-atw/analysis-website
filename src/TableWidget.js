import React from 'react';

import ChartTable from './ChartTable'

import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function TableWidget(props) {
  return (
    <Col>
      <Card>
        <Card.Body>
          <ChartTable data={props.data} columns={props.columns} serial={props.serial} wasm={props.wasm} filters={props.filters} sortBy={props.sortBy}/>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default TableWidget;
