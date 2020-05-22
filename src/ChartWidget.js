import React from "react";
import Chart from 'chart.js';

import predicate from 'apache-arrow';
import * as arrow from 'apache-arrow';

class ChartWidget extends React.Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    
    this.state = {
    	columnName: props.columnName
    }
  }

	render() {
		return (
			<div>
			{this.props.data.count()}<br/>
			<canvas ref={this.myRef}></canvas>
			</div>
		);
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.data != nextProps.data) {
			console.log('a');

			function createPoint(v) { return {x: v, y: v}; }

			let values = [];
			let column = [];		
			const name = this.state.columnName;	
			
			nextProps.data.scan( (idx) => {
				values.push(column(idx));
			}, (batch) => {
			   column = new arrow.predicate.Col(name).bind(batch);
			}); 

			const l = Array.from(values, createPoint);

			console.log(l.length);

			this.myChart.data.datasets.forEach((dataset) => {
				dataset.data = l;
			})
			this.myChart.update();
		}
	}

	componentDidMount() {
		function createPoint(v) { return {x: v, y: v}; }
		let values = [];
		let column = [];
		const name = this.state.columnName;


		this.props.data.scan( (idx) => {
			values.push(column(idx));
		}, (batch) => {
		   column = new arrow.predicate.Col(name).bind(batch);
		}); 

		
		const l = Array.from(values, createPoint);
		console.log(l);

		this.myChart = new Chart(this.myRef.current, {
	    type: 'scatter',
	    data: {
	        datasets: [{
	            label: 'Scatter Dataset',
	            data: l
	        }]
	    },
	    options: {
	        scales: {
	            xAxes: [{
	                type: 'linear',
	                position: 'bottom'
	            }]
	        }
	    }
});
  	}
}

export default ChartWidget;
