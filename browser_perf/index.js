'use strict'




// runs the benchmark in a browser where it can easily be profiled



var sweep = require("../index")
var sweep2 = require("../index2")

var AABB = require('../reference/aabb')

var getVoxel = function (x, y, z) { return (x + 0.5 === 0.25) }
var box = new AABB([0, 0, 0], [3, 3, 3])

box.translate = function () { }

var dir = [Math.random(), Math.random(), Math.random()]
var len = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1] + dir[2] * dir[2])
dir = dir.map(function (n) { return n / len })

var dir30 = dir.map(function (n) { return 30 * n })
var dir60 = dir.map(function (n) { return 60 * n })

var callback = function (dist, axis, dir, vec) {
    return true
}


var button = document.getElementById('run')
button.onclick = function (e) {
    button.childNodes[0].textContent = 'Working'
    setTimeout(function () {
        var sum = warmup()
        sum += run(1)
        sum += run(0)
        window.sum = sum
        button.childNodes[0].textContent = 'Run'
    }, 100)
}


function warmup() {
    var t = performance.now()
    var N = 100000

    var sum = 0, tdir = [0, 0, 0]
    for (var i = 0; i < N; i++) {
        tdir[i % 3] = 10 - 20 * Math.random()
        sum += sweep(getVoxel, box, tdir, callback)
        sum += sweep2(getVoxel, box, tdir, callback)
    }

    var ips = rnd(N * 1000 / (performance.now() - t))
    console.log('Warmup:   iterations/sec: ', ips)
    return sum
}

function test1(box, dir) {
    return sweep(getVoxel, box, dir, callback)
}

function test2(box, dir) {
    return sweep2(getVoxel, box, dir, callback)
}


function run(ver) {
    var dur = 2000
    var ts = [0, 0]
    var sums = [0, 0], ct = 0, N = 1000
    var end = performance.now() + dur
    var i = 0
    var t0, t1, t2
    var dir = (ver) ? dir30 : dir60

    do {
        t0 = performance.now()
        for (i = 0; i < N; i++) sums[0] += test1(box, dir)
        t1 = performance.now()
        for (i = 0; i < N; i++) sums[1] += test2(box, dir)
        t2 = performance.now()

        ts[0] += t1 - t0
        ts[1] += t2 - t1
        ct++
    } while (t2 < end)

    var pct = Math.round(ts[0] / ts[1] * 100)
    var str = 'index took ' + pct + '% as long as index2'
    console.log('Looped', ct, 'times: ts=', ts.map(Math.round), str)
    return sums
}



function rnd(n) { return Math.round(n / 1000) + 'k' }

