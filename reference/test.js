'use strict'


var sweep = require('../index')
var AABB = require('./aabb')


// run ad-hoc tests


var box = new AABB([0, 0, 0], [1, 1, 1])
var getVoxels = function (x, y, z) {
    return (y < 0 || y > 0)
}
var callback = function (dist, axis, dir, vec) {
    console.log(' ----------- hit - dist', dist, 'axis', axis, 'dir', dir)
    console.log('             vec:', vec)
    vec[axis] = 0
    console.log('         new vec:', vec)
}
// box.setPosition([5, 5, 5])
// var dir = [36, -34.12, -37.894390150904655 ]
box.setPosition([0, 0, 0])
var dir = [3, -3, 3]



var dist = sweep(getVoxels, box, dir, callback)

console.log('result: ', box.base)

