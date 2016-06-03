'use strict'

var test = require('tap').test

var AABB = require('../reference/aabb')
var sweep = require('../index')


var epsilon = 1e-5
var equals = function (a, b) { return Math.abs(a - b) < epsilon }
var mag = function (v) { return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) }


test("edge case - fit exactly into a gap", function (t) {

    var box = new AABB([0, 0, 0], [2, 2, 2])
    var dir, res, collided
    var callback = function (dist, axis, dir, vec) {
        collided = true
        return true
    }
    function getVoxels(x, y, z) {
        // 2x2 hole along each axis
        if (x === -1 || x === 0) return false
        if (y === -1 || y === 0) return false
        if (z === -1 || z === 0) return false
        // otherwise solid past xyz=5
        return (Math.abs(x) > 5 || Math.abs(y) > 5 || Math.abs(z) > 5)
    }

    function test(axisNum, sign, axisName) {
        box.setPosition([-1, -1, -1])
        dir = [0, 0, 0]
        dir[axisNum] = 10 * sign
        collided = false
        res = sweep(getVoxels, box, dir, callback)
        t.ok(!collided, 'No collision, axis test, ' + axisName)
        t.equals(res, 10, 'No collision, axis test, ' + axisName)
    }

    test(0, 1, '+X')
    test(0, -1, '-X')
    test(1, 1, '+Y')
    test(1, -1, '-Y')
    test(2, 1, '+Z')
    test(2, -1, '-Z')

    t.end()
})



test("edge case - between two walls", function (t) {

    var box = new AABB([0, 0, 0], [2, 2, 2])
    var callback = function (dist, axis, dir, vec) {
        vec[axis] = 0
    }

    function testAxis(axis, dir) {
        var getVoxels = function (x, y, z) {
            if (axis === 0) return (x < -1 || x > 0)
            if (axis === 1) return (y < -1 || y > 0)
            if (axis === 2) return (z < -1 || z > 0)
        }
        box.setPosition([-1, -1, -1])
        var adjDir = dir.slice()
        adjDir[axis] = 0
        var expectedDist = mag(adjDir)
        var dist = sweep(getVoxels, box, dir, callback)
        return equals(dist, expectedDist)
    }

    t.ok(testAxis(0, [0, 3, 3]), 'No collision between two walls, axis X')
    t.ok(testAxis(1, [3, 0, 3]), 'No collision between two walls, axis Y')
    t.ok(testAxis(2, [3, 3, 0]), 'No collision between two walls, axis Z')

    t.ok(testAxis(0, [3, 3, 3]), 'No collision moving into two walls, axis X')
    t.ok(testAxis(1, [3, 3, 3]), 'No collision moving into two walls, axis Y')
    t.ok(testAxis(2, [3, 3, 3]), 'No collision moving into two walls, axis Z')

    t.ok(testAxis(0, [-3, 3, 3]), 'No collision moving into two walls, axis X')
    t.ok(testAxis(1, [3, -3, 3]), 'No collision moving into two walls, axis Y')
    t.ok(testAxis(2, [3, 3, -3]), 'No collision moving into two walls, axis Z')

    t.end()
})



