'use strict'


var sweep = require('../index')
var AABB = require('./aabb')
var rand = function (a, b) { return a + (b - a) * Math.random() }

// run ad-hoc tests


var box = new AABB([0, 0, 0], [0.8, 0.8, 0.8])
var getVoxels = function (x, y, z) {
    if (x >= 10) return true
    // if (y > 10) return true
    // if (z > 10) return true
}
var callback = function (dist, axis, dir, vec) {
    return true
    // console.log(' ----------- hit - dist', dist, 'axis', axis, 'dir', dir)
    // console.log('             vec:', vec)
    // vec[axis] = 0
    // console.log('         new vec:', vec)
}

box.setPosition([0.2, 0.2, 0.2])
var dir = [50.13, 3.11, 3.33]
var dist = sweep(getVoxels, box, dir, callback)

console.log('========= test result')
console.log('base', box.base)
console.log('max', box.max)
console.log('dir', dir)


