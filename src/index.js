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



import './style.scss'

import React from 'react';
import ReactDOM from 'react-dom'

import App from './App'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import { Table } from "apache-arrow"

import { Utf8Vector, FloatVector, predicate } from "apache-arrow"

import {init, compute} from "./wasm_interopt.js"

async function getSerializedData() {
  return await fetch("/speeches.arrow")
}

async function generateData() {
  return init("add.wasm").then(wasm => {
    return getSerializedData().then(resp => {
      return resp.arrayBuffer().then(function(data) {

        const arr = new Uint8Array(data)

        let d = Table.from(data)

        init("ratio_of_speeches.wasm").then( mod => console.log(compute(mod, arr)))

        return { data: d, value: arr, wasm: wasm }
      })
    })
  })
}


generateData().then(data => {
ReactDOM.render(
  <Container>
    <App data={data.data} serial={data.value} wasm={data.wasm}/>
  </Container>
  ,document.getElementById('index')
);
}
);
