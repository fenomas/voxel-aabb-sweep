'use strict'


var sweep = require('../index')
var brute = require('./bruteForce')
var altrn = require('./alternate_impl')



// run ad-hoc tests



var voxels1 = function (x, y, z) { return false }
var voxels2 = function (x, y, z) {
    if (Math.abs(x) == 2) return true
    if (Math.abs(y) == 2) return true
    if (Math.abs(z) == 2) return true
    return false
}

var b = 0.5
var m = 1
var box = { base: [b, b, b], max: [m, m, m] }
var dir = [0, -10, 0]

var hit1 = [0, 0, 0]
var hit2 = [0, 0, 0]
var hit3 = [0, 0, 0]
var norm1 = [0, 0, 0]
var norm2 = [0, 0, 0]
var norm3 = [0, 0, 0]

var d1 = sweep(voxels2, box, dir, hit1, norm1)
var d2 = brute(voxels2, box, dir, hit2, norm2)
var d3 = altrn(voxels2, box, dir, hit3, norm3)


function fix(n) { return n.toFixed(4) }
var s = '    '

console.log('sweep   ', fix(d1), s, hit1.map(fix).join(', '), s, norm1.join(', '))
console.log('brute   ', fix(d2), s, hit2.map(fix).join(', '), s, norm2.join(', '))
console.log('alt     ', fix(d3), s, hit3.map(fix).join(', '), s, norm3.join(', '))


function eq(a,b) { return Math.abs(a-b) < 1e-3 }
function eqarr(a,b) {
    for (var i=0; i<a.length; i++) if (!eq(a[i],b[i])) return false
    return true
}

var sweepok = eq(d1, d2) && eqarr(hit1, hit2)  && eqarr(norm1, norm2) 
var altrnok = eq(d3, d2) && eqarr(hit3, hit2)  && eqarr(norm3, norm2) 
console.log('sweep ', (sweepok) ? 'OK' : 'FAIL')
console.log('alt   ', (altrnok) ? 'OK' : 'FAIL')


