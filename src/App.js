import React from 'react';

import ChartWidget from './ChartWidget'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


import { Table, Utf8Vector, FloatVector, predicate } from "apache-arrow";


function ChartHolder(props) {
  return (
    <Col xs={3}> <ChartWidget data={props.data} columnName={props.columnName}/> </Col>
  );
}

function ChartList(props) {
  const charts = props.charts;
  const data = props.data;

  console.log(charts);

  return charts.map( (chart) => 
    <ChartHolder key={chart.name.toString()} data={data} columnName={chart.column}/>
  );
}

function generateData() {
  const LENGTH = 50;

const r = Float64Array.from(
  { length: LENGTH },
    () => Number((Math.random() * 20).toFixed(1)));


const rainAmounts = Float64Array.from(
  { length: LENGTH },
    () => Number((Math.random() * 50).toFixed(1)));

const rain2 = Float64Array.from(
  { length: LENGTH },
    () => Number((Math.random() * 10+3).toFixed(1)));


return Table.new(
  [Utf8Vector.from(r), FloatVector.from(rainAmounts), FloatVector.from(rain2)],
    ['city','lat', 'lng']
    );

}

class App extends React.Component {
  constructor(props) {
    super(props);


    const data = generateData();
    this.state = { 
      charts: [{name:1, column: 'lat'}, {name:2, column: 'lat'}],
      data: data,
      currentSelection: 'lat'
     };

    // This binding is necessary to make `this` work in the callback
    this.addChart = this.addChart.bind(this);
    this.currentSelection = this.currentSelection.bind(this);    
    this.filter = this.filter.bind(this);    

  }

  addChart(event) {
    
    this.setState(function(state, props) {
      var charts = this.state.charts;
      const newChart = charts.concat([{name: charts.length+1, column: this.state.currentSelection}]);
      console.log(newChart);
      return { charts: newChart}
   });
  }

  currentSelection(event) {
    console.log(event.target.value);
    this.setState({currentSelection: event.target.value});
  }

  filter() {
    this.setState(function(state, props) {
      return {data: this.state.data.filter(predicate.col('lat').gt(5)) }
    });
  }

  render() { 
    return (
    <div>
      <Row>
         <ChartList charts={this.state.charts} data={this.state.data}/>
      </Row>
      <Row>
          <Form>
            <Form.Label>Column Name</Form.Label>
            <Form.Row>
              <Form.Group as={Col} controlId="columnName">
               <Form.Control type="text" placeholder={this.state.currentSelection} onChange={this.currentSelection}/>
              </Form.Group>
              <Col>
                <Button variant="primary" onClick={this.addChart}>Add new Chart</Button>
              </Col>
            </Form.Row>
          </Form>
      </Row>  
      <Row>
        <Button variant="primary" onClick={this.filter}>Filter</Button>
      </Row>
    </div>
  );}
}

export default App;
