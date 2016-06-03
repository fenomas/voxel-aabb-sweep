'use strict'

var test = require('tap').test

var AABB = require('../reference/aabb')
var sweep = require('../index')


var N = 1000
var epsilon = 1e-5
var equals = function (a, b) { return Math.abs(a - b) < epsilon }
var rand = function (a, b) { return a + (b - a) * Math.random() }
var mag = function (v) { return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) }


test("more randomized tests", function (t) {

    // cast at oblique angles into a flat ground, looking for cases where things fail early
    var getVoxels = function (x, y, z) {
        return (y < 0)
    }
    var box = new AABB([0, 0, 0], [1, 1, 1])
    var callback = function (dist, axis, dir, vec) {
        vec[axis] = 0
    }

    function runTest(i) {
        box.setPosition([5, 5, 5])
        var dir = [rand(-50, 50), rand(-10, -50), rand(-50, 50)]
        var expected = [5 + dir[0], 0, 5 + dir[2]]
        var dist = sweep(getVoxels, box, dir, callback)
        var ok = equals(box.base[0], expected[0])
        ok = ok && equals(box.base[1], expected[1])
        ok = ok && equals(box.base[2], expected[2])

        if (!ok) {
            t.fail('Randomized test failed on ' + i + 'th test')
            console.log('=== expected', expected)
            console.log('=== base', box.base)
            console.log('=== dir', dir)
            return false
        }
        return true
    }

    var ok = true
    for (var i = 0; i < N; i++) {
        ok = ok && runTest(i)
        if (!ok) break
    }

    if (ok) t.pass('Passed ' + N + ' randomized sliding tests')

    t.end()
})


