//import { Table } from "apache-arrow";
import init,{ reduce } from './hello_world.js'; 
import {
    Table,
      FloatVector,
        DateVector, Utf8Vector, RecordBatchJSONWriter, RecordBatchWriter,
} from 'apache-arrow';

async function foo() {
 // const arrow = await fetch(("/simple.arrow"));


 // Table.from(arrow).then(rainfall => console.log(new RecordBatchJSONWriter().writeAll(rainfall).toString(true)));

const LENGTH = 2000;

const r = Float64Array.from(
  { length: LENGTH },
    () => Number((Math.random() * 20).toFixed(1)));


const rainAmounts = Float64Array.from(
  { length: LENGTH },
    () => Number((Math.random() * 20).toFixed(1)));

const rain2 = Float64Array.from(
  { length: LENGTH },
    () => Number((Math.random() * 20).toFixed(1)));


const rainfall = Table.new(
  [Utf8Vector.from(r), FloatVector.from(rainAmounts), DateVector.from(rain2)],
    ['city','lat', 'lng']
    );

  const data = new RecordBatchWriter().writeAll(rainfall).toUint8Array(true);

 //const data = await arrow.blob(); 

  let rv = await init();
  const result = reduce(rv, data);//new Uint8Array(data.arrayBuffer()));
  console.log(result);
}

foo();
