
import './style.scss'

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { Table } from "apache-arrow";

import { init, reduce, map } from "./hello_world";

async function getSerializedData() {
  return await fetch("/speeches.arrow")
}

async function generateData() {
  return init().then(wasm => {
    return getSerializedData().then(resp => {
      return resp.arrayBuffer().then(function(data) {
        console.log(map(wasm, new Uint8Array(data)))
        let d = Table.from(data)
        console.log(d.schema)
        return d
      })
    })
  })
}


generateData().then(data => {
ReactDOM.render(
  <Container>
    <App data={data.slice(0,50000)}/>
  </Container>
  ,document.getElementById('index')
);
}
);
