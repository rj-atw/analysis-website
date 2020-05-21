import React from 'react';

import ChartWidget from './ChartWidget'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function ChartHolder(props) {
  return (
    <Col xs={3}> <ChartWidget/> </Col>
  );
}

function ChartList(props) {
  const charts = props.charts;

  console.log(charts);
  return charts.map( (chart) => 
    <ChartHolder key={chart.toString()}/>
  );
}

class App extends React.Component {
  render() { 
    const charts= [1,2];
    return (
      <Row>
         <ChartList charts={charts}/>
      </Row>
  );}
}

export default App;
