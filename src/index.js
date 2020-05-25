
import './style.scss'

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { Table } from "apache-arrow";

async function generateData() {
  return await Table.from(fetch("/gov.arrow"));
  //return await Table.from(fetch("https://gist.githubusercontent.com/TheNeuralBit/64d8cc13050c9b5743281dcf66059de5/raw/c146baf28a8e78cfe982c6ab5015207c4cbd84e3/scrabble.arrow"));
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
