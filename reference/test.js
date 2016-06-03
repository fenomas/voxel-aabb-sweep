'use strict'


var sweep = require('../index')
var AABB = require('./aabb')


// run ad-hoc tests


var box = new AABB([0, 0, 0], [2, 2, 2])
var callback = function (dist, axis, dir, vec) { vec[axis] = 0 }
var getVoxels = function (x, y, z) {
    return (x < -1 || x > 0)
}
var dir = [3, 3, 3]
box.setPosition([-1, -1, -1])
var dist = sweep(getVoxels, box, dir, callback)

console.log(dist)

