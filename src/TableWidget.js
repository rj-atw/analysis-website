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
