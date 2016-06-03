'use strict'

var test = require('tap').test

var AABB = require('../reference/aabb')
var sweep = require('../index')


var EPSILON = 1e-5
function eq(a,b) { return Math.abs(a-b) < EPSILON }



test("basics", function (t) {

    var getVoxels = function () { return false }
    var box = new AABB([0.25, 0.25, 0.25], [0.75, 0.75, 0.75])
    var dir = [0, 0, 0]
    var collided = false
    var callback = function (dist, axis, dir, left) {
        collided = true
        return true
    }
    var res


    t.doesNotThrow(function () { res = sweep(getVoxels, box, dir, callback) }, 'Does not throw on empty direction vector')
    t.ok(!collided, 'No collision with empty vector')
    t.equals(res, 0, 'No movement with empty vector')
    t.equals(box.base[0], 0.25, 'No movement with empty vector')
    t.equals(box.base[1], 0.25, 'No movement with empty vector')
    t.equals(box.base[2], 0.25, 'No movement with empty vector')


    dir = [10, -5, -15]
    box.setPosition([0.25, 0.25, 0.25])
    collided = false
    res = sweep(getVoxels, box, dir, callback)
    t.ok(!collided, 'No collision moving through empty voxels')
    t.equals(res, Math.sqrt(100 + 25 + 225), 'Full movement through empty voxels')
    t.equals(box.base[0], 0.25 + dir[0], 'Full movement through empty voxels')
    t.equals(box.base[1], 0.25 + dir[1], 'Full movement through empty voxels')
    t.equals(box.base[2], 0.25 + dir[2], 'Full movement through empty voxels')


    getVoxels = function () { return true }
    dir = [0, 0, 0]
    box.setPosition([0.25, 0.25, 0.25])
    collided = false
    res = sweep(getVoxels, box, dir, callback)
    t.ok(!collided, 'No collision not moving through full voxels')
    t.equals(res, 0, 'No collision not moving through full voxels')


    dir = [1, 0, 0]
    box.setPosition([0.25, 0.25, 0.25])
    collided = false
    res = sweep(getVoxels, box, dir, callback)
    t.ok(collided, 'Collision moving through full voxels')
    t.equals(res, 0.25, 'Collision moving through full voxels')
    t.equals(box.base[0], 0.5, 'Collision moving through full voxels')
    t.equals(box.base[1], 0.25, 'Collision moving through full voxels')
    t.equals(box.base[2], 0.25, 'Collision moving through full voxels')


    box = new AABB([0, 0, 0], [10, 10, 10])
    dir = [0, 5, 0]
    getVoxels = function (x, y, z) {
        return (x === 8 && z === 8 && y === 13)
    }
    collided = false
    res = sweep(getVoxels, box, dir, callback)
    t.ok(collided, 'Big box collides with single voxel')
    t.equals(res, 3, 'Big box collides with single voxel')
    t.equals(box.base[0], 0, 'Big box collides with single voxel')
    t.equals(box.base[1], 3, 'Big box collides with single voxel')
    t.equals(box.base[2], 0, 'Big box collides with single voxel')


    box = new AABB([0, 0, 0], [1, 1, 1])
    dir = [10, 10, 0]
    getVoxels = function (x, y, z) {
        return (x > 5)
    }
    collided = false
    callback = function (dist, axis, dir, left) {
        collided = true
        left[axis] = 0
    }
    res = sweep(getVoxels, box, dir, callback)
    t.ok(collided, 'Collides with wall and keeps going on other axis')
    var tgtdist = Math.sqrt(25 + 25) + 5
    t.ok(eq(res, tgtdist), 'Collides with wall and keeps going on other axis')
    t.equals(box.base[0], 5, 'Collides with wall and keeps going on other axis')
    t.equals(box.base[1], 10, 'Collides with wall and keeps going on other axis')
    t.equals(box.base[2], 0, 'Collides with wall and keeps going on other axis')
    
    
    box = new AABB([0, 0, 0], [1, 1, 1])
    dir = [1, 1, 1]
    getVoxels = function () {}
    callback = function () {}
    res = sweep(getVoxels, box, dir, callback, 1)
    t.equals(box.base[0], 0, 'No translation when noTranslate is truthy')
    t.equals(box.base[1], 0, 'No translation when noTranslate is truthy')
    t.equals(box.base[2], 0, 'No translation when noTranslate is truthy')
    

    t.end()
})


