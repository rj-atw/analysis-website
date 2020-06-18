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

import { Table } from "apache-arrow";

let cachegetUint8Memory0 = new Map();
let cachegetFloat64Memory0 = new Map();
let cachegetBigInt64Memory0 = new Map();
let cachegetUint32Memory0 = new Map();
let moduleCache = new Map();

function getUint8Memory0(wasm_mod) {
	//cachegetUint32Memory0.buffer !== wasm.memory.buffer
 //   if (!cachegetUint8Memory0.has(wasm_mod)) {
        cachegetUint8Memory0.set(wasm_mod, new Uint8Array(wasm_mod.memory.buffer));
   // }
    return cachegetUint8Memory0.get(wasm_mod);
}

function getFloat64Memory0(wasm_mod) {
	//cachegetUint32Memory0.buffer !== wasm.memory.buffer
    if (!cachegetFloat64Memory0.has(wasm_mod)) {
        cachegetFloat64Memory0.set(wasm_mod, new Float64Array(wasm_mod.memory.buffer));
    }
    return cachegetFloat64Memory0.get(wasm_mod);
}

function getBigInt64Memory0(wasm_mod) {
	//cachegetUint32Memory0.buffer !== wasm.memory.buffer
    if (!cachegetBigInt64Memory0.has(wasm_mod)) {
        cachegetBigInt64Memory0.set(wasm_mod, new BigInt64Array(wasm_mod.memory.buffer));
    }
    return cachegetBigInt64Memory0.get(wasm_mod);
}

function getUint32Memory0(wasm_mod) {
	//cachegetUint32Memory0.buffer !== wasm.memory.buffer
//    if (!cachegetUint32Memory0.has(wasm_mod)) {
     return    new Uint32Array(wasm_mod.memory.buffer)
  //  }
  //  return cachegetUint32Memory0.get(wasm_mod);
}


let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, wasm_mod) {
    const ptr = wasm_mod.__wbindgen_malloc(arg.length);
    getUint8Memory0(wasm_mod).set(arg, ptr);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

/**
* @param {Uint32Array} a
* @returns {number}
*/
export function sort(wasm_mod, a, filter, idx, limit) {
    var ptr0 = passArray8ToWasm0(a, wasm_mod);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArray8ToWasm0(filter, wasm_mod);

    const size = limit*4+1000;
    const out_ptr = wasm_mod.__wbindgen_malloc(size);
    const err_ptr = wasm_mod.__wbindgen_malloc(200);

    var ret_ptr = wasm_mod.limit_sorted_filter(ptr0, len0, ptr1, filter.length, idx, limit, out_ptr, size, err_ptr);
    if(ret_ptr==0) {
      var err = new TextDecoder("utf-8").decode(getUint8Memory0(wasm_mod).slice(err_ptr, err_ptr+200))
      console.log(err)

      return null
    } else {
      var data = getUint8Memory0(wasm_mod).slice(ret_ptr, ret_ptr+size)
        
      let d = Table.from(data)
      
      return d.getColumn("result").toArray()
    }
}


export function compute(wasm_mod, a) {
  const ptr0 = passArray8ToWasm0(a, wasm_mod)
  const len0 = WASM_VECTOR_LEN

  const size = len0
  const out_ptr = wasm_mod.__wbindgen_malloc(size)

  if(wasm_mod.compute(ptr0, len0, out_ptr, size) == 0) {
    let err = new TextDecoder("utf-8").decode(getUint8Memory0(wasm_mod).slice(out_ptr, out_ptr+200))
    console.log(err)
  } else {
    let data = getUint8Memory0(wasm_mod).slice(out_ptr, out_ptr+size)
    
    let d = Table.from(data)
    return d.getColumn("speech_ratio").toArray() 
  }
}

export function init(file_name) {
    if(!file_name.endsWith("wasm")) {
      file_name = file_name + ".wasm"
    }

    if(moduleCache.has(file_name)) {
	    return Promise.resolve(moduleCache.get(file_name))
    }

    let result;
    const imports = {};

        const response = fetch("http://localhost:8080/" + file_name)
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            result = WebAssembly.instantiateStreaming(response, imports)
            .catch(e => {
                return response
                .then(r => {
                    if (r.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                        return r.arrayBuffer();
                    } else {
                        throw e;
                    }
                })
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            });
        } else {
            result = response
            .then(r => r.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports));
        }
    return result.then(({instance, module}) => {
        let wasm = instance.exports;
        init.__wbindgen_wasm_module = module;
	      moduleCache.set(file_name, wasm)   

        return wasm;
    });
}


