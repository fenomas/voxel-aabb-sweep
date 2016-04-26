'use strict';

var Benchmark = require('benchmark')
Benchmark.options.maxTime = 2
var suite = new Benchmark.Suite()


/***********************************  SETUP  ************************************/

var sweep = require("../index")
var sweep2 = require("../reference/alternate_impl")

var getVoxel = function () { return false }
var box1 = { base: [0, 0, 0], max: [1, 1, 1] }
var box10 = { base: [0, 0, 0], max: [10, 10, 10] }

var dir = [Math.random(), Math.random(), Math.random()]
var len = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1] + dir[2] * dir[2])
dir = dir.map(function (n) { return n / len })

var dir100 = dir.map(function (n) { return 100 * n })
var dir1000 = dir.map(function (n) { return 1000 * n })



/***********************************  WARMUP  ************************************/


var sum = 0, tdir = [];
(function () {
    for (var i = 0; i < 10000; i++) {
        tdir[0] = 10 - 20 * Math.random()
        tdir[1] = 10 - 20 * Math.random()
        tdir[2] = 10 - 20 * Math.random()
        sum += sweep(getVoxel, box1, tdir)
        sum += sweep2(getVoxel, box1, tdir)
    }
    return sum
})()


/***********************************  SUITES  ************************************/

suite.add('Sweep        - box 10, dist=100', function () {
    return sweep(getVoxel, box10, dir100)
})

suite.add('Alt. version - box 10, dist=100', function () {
    return sweep2(getVoxel, box10, dir100)
})

suite.add('Sweep        - box 1 , dist=100', function () {
    return sweep(getVoxel, box1, dir100)
})

suite.add('Alt. version - box 1 , dist=100', function () {
    return sweep2(getVoxel, box1, dir100)
})


// suite.add('Sweep        - box 1 , dist=1000', function () {
//     return sweep(getVoxel, box1, dir1000)
// })

// suite.add('Alt. version - box 1 , dist=1000', function () {
//     return sweep2(getVoxel, box1, dir1000)
// })




/***********************************  EXECUTE  ************************************/


// add listeners and run
suite.on('cycle', function (event) {
    console.log(String(event.target))
}).on('complete', function () {
    // console.log('Fastest is ' + this.filter('fastest').map('name'))
    console.log('All suites executed without error')
}).run({ 'async': true })

