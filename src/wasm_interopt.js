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
export function filter(wasm_mod, a, filter) {
    var ptr0 = passArray8ToWasm0(a, wasm_mod);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArray8ToWasm0(filter, wasm_mod);


    var ret_ptr = wasm_mod.filter(ptr0, len0, ptr1, filter.length)/8;
    var ret = getBigInt64Memory0(wasm_mod).slice(ret_ptr, ret_ptr+10);

    return ret
}

/**
* @param {Uint32Array} a
* @returns {number}
*/
export function sort(wasm_mod, a, filter, idx, limit) {
    var ptr0 = passArray8ToWasm0(a, wasm_mod);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArray8ToWasm0(filter, wasm_mod);

    const out_ptr = wasm_mod.__wbindgen_malloc(limit*4);

    var ret_ptr = wasm_mod.limit_sorted_filter(ptr0, len0, ptr1, filter.length, idx, limit, out_ptr)/4;
    var ret = getUint32Memory0(wasm_mod).slice(ret_ptr, ret_ptr+limit);

    return ret
}

/**
* @param {Uint32Array} a
* @returns {number}
*/
export function reduce(wasm_mod, a) {
    var ptr0 = passArray8ToWasm0(a, wasm_mod);
    var len0 = WASM_VECTOR_LEN;

    var ret = wasm_mod.reduce(ptr0, len0);
    return ret >>> 0;
}

/**
* @param {Uint32Array} a
* @returns {number}
*/
export function map(wasm_mod, a) {
    var ptr0 = passArray8ToWasm0(a, wasm_mod);
    var len0 = WASM_VECTOR_LEN;

    var len1 = 500;
    var ptr1 = wasm_mod.map(ptr0, len0) /8;

    var ret = getBigInt64Memory0(wasm_mod).slice(ptr1, ptr1+len1);
    return ret;
}

export function init() {
    if(moduleCache.has("a")) {
	    return Promise.resolve(moduleCache.get("a"))
    }

    let result;
    const imports = {};

        const response = fetch("http://localhost:8080/add.wasm")
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
	      moduleCache.set("a", wasm)   

        return wasm;
    });
}


