import React from 'react';

import Table from 'react-bootstrap/Table';

import * as arrow from "apache-arrow";

function LimitRows(props) {

	let values1 = [];
	let values2 = [];
	let column1 = [];		
	let column2 = [];		
			
	props.data.scan( (idx) => {
		values1.push(column1(idx));
		values2.push(column2(idx));
	}, (batch) => {
		column1 = new arrow.predicate.Col(props.column[0]).bind(batch);
		column2 = new arrow.predicate.Col(props.column[1]).bind(batch);
	}); 

  return Array.from({length: 10}, (x,i) => <tr key={i}><td>{values1[i]}</td><td>{values2[i]}</td></tr>)
}


function ChartTable(props) {
  return (
    <Table striped bordered size="sm">
      <thead>
        <tr>
          <th>{props.columns[0]}</th>
          <th>{props.columns[1]}</th>
        </tr>
      </thead>

      <tbody>
        <LimitRows limit={10} column={props.columns} data={props.data}/>
      </tbody>
    </Table>
  )
}

export default ChartTable
