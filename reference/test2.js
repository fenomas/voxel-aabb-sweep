'use strict'


var sweep = require('../index')
var brute = require('./bruteForce')



// run ad-hoc tests



function fix(n) { return n.toFixed(3) }

var fakeVoxel = function (x, y, z) {
    if (Math.abs(x) == 2) return true
    if (Math.abs(y) == 2) return true
    if (Math.abs(z) == 2) return true
    return false
}
var box = {
    base: [0.50, 0.50, 0.50],
    max:  [0.51, 0.51, 0.51],
}
var dir = [0, 10, 0]
var hit1 = [0, 0, 0]
var hit2 = [0, 0, 0]
var d1, d2

console.log('sweep', fix(d1 = sweep(fakeVoxel, box, dir, hit1)), '  ', hit1.map(fix))
console.log('brute', fix(d2 = brute(fakeVoxel, box, dir, hit2)), '  ', hit2.map(fix))



var epsilon = 1e-3 // brute force does 1e5 iterations
var equals = function (a, b) { return Math.abs(a - b) < epsilon }

var ok = true
ok = ok && equals(d1, d2)
ok = ok && equals(hit1[0], hit2[0])
ok = ok && equals(hit1[1], hit2[1])
ok = ok && equals(hit1[2], hit2[2])
console.log( ok ? 'OKAY' : 'FAIL')




