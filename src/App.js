import React from 'react';

import ChartWidget from './ChartWidget'
import DashboardControl from './DashboardControl'
import ChartTable from './ChartTable'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';


import { Table, Utf8Vector, FloatVector, predicate } from "apache-arrow";


function ChartHolder(props) {
  return (
    <Col xs={12}> <ChartWidget data={props.data} columnName={props.columnName}/> </Col>
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

async function generateData() {
  return await Table.from(fetch("/scrabble.arrow"));
/*
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
*/

}

class App extends React.Component {
  constructor(props) {
    super(props);


    const data = props.data;
    this.state = { 
      charts: [{name:1, column: data.schema.fields[0].name}],
      data: data,
      currentSelection: data.schema.fields[0].name
     };

    // This binding is necessary to make `this` work in the callback
    this.addChart = this.addChart.bind(this);
    this.currentSelection = this.currentSelection.bind(this);    
    this.filter = this.filter.bind(this);    
    this.applyFilters = this.applyFilters.bind(this);    

    this.baseData = data;
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

  applyFilters(filters) {
    this.setState(function(state, props) {
      let andedFilter = filters.reduce( (acc, filter) => acc.and(filter));
      console.log(andedFilter);
      return {data: this.baseData.filter(andedFilter) }
    });
  }

  render() { 
    return (
    <div>
      <Row bgcolor="blue">
        <DashboardControl schema={this.state.data.schema} propagateSelectedFilter={this.applyFilters}/>
      </Row>
      <Row>
         <Col xs={12} sm={6} lg={4}>
           <Card>
             <Card.Body>
               <ChartList charts={this.state.charts} data={this.state.data}/>
             </Card.Body>
           </Card>  
         </Col>
         <Col xs={12} sm={6} lg={8}>
           <Row>
            <Col xs={6} sm={6} lg={4}>
               <Card>
                <Card.Body>
                  <ChartTable data={this.state.data} columns={[this.state.data.schema.fields[0].name, this.state.data.schema.fields[1].name]}/>
                </Card.Body>
               </Card>
            </Col>
            <Col xs={6} sm={6} lg={4}>
               <Card>
                <Card.Body>
                  <ChartTable data={this.state.data} columns={[this.state.data.schema.fields[0].name, this.state.data.schema.fields[2].name]}/>
                </Card.Body>
               </Card>
            </Col>
            </Row>
         </Col>
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
