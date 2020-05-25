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

  return charts.map( (chart) => 
    <ChartHolder key={chart.name.toString()} data={data} columnName={chart.column}/>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);


    const data = props.data;
    this.state = { 
      charts: [],
      //charts: [{name:1, column: data.schema.fields[0].name}],
      data: data,
      currentSelection: data.schema.fields[0].name,
      baseData: data
     };

    // This binding is necessary to make `this` work in the callback
    this.addChart = this.addChart.bind(this);
    this.currentSelection = this.currentSelection.bind(this);    
    this.filter = this.filter.bind(this);    
    this.applyFilters = this.applyFilters.bind(this);    
    this.setData = this.setData.bind(this);
  }

  setData(data) {
     this.setState( function(state,prop) { return { 
       charts: [],
    //   charts: [{name:1, column: data.schema.fields[0].name}],
       baseData: data, data: data
     }})
  }

  addChart(event) {
    
    this.setState(function(state, props) {
      var charts = this.state.charts;
      const newChart = charts.concat([{name: charts.length+1, column: this.state.currentSelection}]);
      return { charts: newChart}
   });
  }

  currentSelection(event) {
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
      return {data: this.state.baseData.filter(andedFilter) }
    });
  }

  render() { 
    return (
    <div>
      <Row bgcolor="blue">
        <DashboardControl setData={this.setData} schema={this.state.data.schema} propagateSelectedFilter={this.applyFilters}/>
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
