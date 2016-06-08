'use strict'

var test = require('tap').test

var AABB = require('../reference/aabb')
var sweep = require('../index')


var N = 500
var epsilon = 1e-5
var equals = function (a, b) { return Math.abs(a - b) < epsilon }


test("correctness (unobstructed)", function (t) {

    // correct behavior when there's no obstruction
    var noVoxels = function () { return false }
    var box = new AABB([0, 0, 0], [0, 0, 0])
    var dir = [0, 0, 0]
    var collided = false
    var callback = function (dist, axis, dir, left) {
        collided = true
        return true
    }

    // comparisons
    var ok

    for (var i = 0; i < N; i++) {
        var expected = []
        var sum = 0
        collided = false
        // randomize
        for (var j = 0; j < 3; j++) {
            box.base[j] = 1 - 2 * Math.random()
            box.max[j] = box.base[j] + 0.01 + 3 * Math.random()
            dir[j] = 20 * (0.5 - Math.random())
            expected[j] = box.base[j] + dir[j]
            sum += dir[j] * dir[j]
        }
        var dist = Math.sqrt(sum)

        // find results
        var res = sweep(noVoxels, box, dir, callback)

        // compare
        ok = true
        ok = ok && !collided
        ok = ok && equals(box.base[0], expected[0])
        ok = ok && equals(box.base[1], expected[1])
        ok = ok && equals(box.base[2], expected[2])
        ok = ok && equals(dist, res)

        if (!ok) {
            t.fail('Unobstructed results differed on ' + i + 'th test')
            break
        }
    }

    if (ok) t.pass('Passed ' + N + ' random correctness tests (unobstructed).')

    t.end()
})



test("correctness (flat wall)", function (t) {

    var getVoxels = [
        function (x, y, z) { return Math.abs(x) === 5 },
        function (x, y, z) { return Math.abs(y) === 5 },
        function (x, y, z) { return Math.abs(z) === 5 }
    ]
    var box = new AABB([0, 0, 0], [1, 1, 1])
    var dir = [0, 0, 0]
    var callback = function (dist, axis, dir, vec) {
        vec[axis] = 0
    }

    function test(axis, sign) {
        box.setPosition([1, 1, 1])
        var dir = [2, 2, 2]
        dir[axis] = 10 * sign
        var expected = []
        for (var j = 0; j < 3; j++) expected[j] = box.base[j] + dir[j]
        expected[axis] = (sign > 0) ? 4 : -4
        var dist = sweep(getVoxels[axis], box, dir, callback)

        ok = ok && equals(expected[0], box.base[0])
        ok = ok && equals(expected[1], box.base[1])
        ok = ok && equals(expected[2], box.base[2])

        if (!ok) {
            t.fail('Obstructed test failed (box) ')
            console.log('axis, dir', axis, dir)
            console.log('box.base', box.base)
            console.log('expected', expected)
        }
        return ok
    }

    var ok = true;
    [0, 1, 2].map(function (axis) {
        [1, -1].map(function (dir) {
            if (!ok) return
            ok = ok && test(axis, dir)
        })
    })

    if (ok) t.pass('Obstructed (one wall).')

    t.end()
})


test("correctness (box)", function (t) {

    var getVoxels = function (x, y, z) {
        if (Math.abs(x) === 5) return true
        if (Math.abs(y) === 5) return true
        if (Math.abs(z) === 5) return true
        return false
    }
    var box = new AABB([0, 0, 0], [1, 1, 1])
    var dir = [0, 0, 0]
    var callback = function (dist, axis, dir, vec) {
        vec[axis] = 0
    }

    var test = function (dx, dy, dz) {
        box.setPosition([1, 1, 1])
        var dir = [dx, dy, dz]
        var expected = []
        for (var j = 0; j < 3; j++) expected[j] = (dir[j] > 0) ? 4 : -4

        var dist = sweep(getVoxels, box, dir, callback)
        ok = ok && equals(expected[0], box.base[0])
        ok = ok && equals(expected[1], box.base[1])
        ok = ok && equals(expected[2], box.base[2])

        if (!ok) {
            t.fail('Obstructed test failed (box)')
            console.log('dx, dy, dz', dx, dy, dz)
            console.log('box.base', box.base)
            console.log('expected', expected)
        }
        return ok
    }

    var ok = true
    if (ok) ok = ok && test(12, 15, 17)
    if (ok) ok = ok && test(-12, 15, 17)
    if (ok) ok = ok && test(12, -15, 17)
    if (ok) ok = ok && test(-12, -15, 17)
    if (ok) ok = ok && test(12, 15, -17)
    if (ok) ok = ok && test(-12, 15, -17)
    if (ok) ok = ok && test(12, -15, -17)
    if (ok) ok = ok && test(-12, -15, -17)

    if (ok) t.pass('Obstructed (box).')

    t.end()
})




test("correctness (nearby obstruction)", function (t) {

    var getVoxels = function (x, y, z) {
        if (Math.abs(x) < 2 &&
            Math.abs(y) < 2 &&
            Math.abs(z) < 2) return true
        return false
    }
    var box = new AABB([0, 0, 0], [2, 2, 2])

    var test = function (axis, dir) {
        var arr = [-1, -1, -1]
        var vec = [6, 6, 6]
        arr[axis] = 10 * dir
        vec[axis] = -12 * dir
        box.setPosition(arr)
        var expected = [5, 5, 5]
        expected[axis] = -2 * dir

        var dist = sweep(getVoxels, box, vec, function (dist, axis, dir, vec) {
            console.log('-------', dist, axis, dir, vec)
            vec[axis] = 0
            return true
        })

        var ok = equals(expected[0], box.base[0])
        ok = ok && equals(expected[1], box.base[1])
        ok = ok && equals(expected[2], box.base[2])

        if (!ok) {
            t.fail('Nearby obstruction test failed')
            console.log('   axis, dir', axis, dir)
            console.log('   box.base', box.base)
            console.log('   expected', expected)
        }
        return ok
    }

    var ok = true
    if (ok) ok = ok && test(0, 1)
    if (ok) ok = ok && test(1, 1)
    if (ok) ok = ok && test(2, 1)
    if (ok) ok = ok && test(0, -1)
    if (ok) ok = ok && test(1, -1)
    if (ok) ok = ok && test(2, -1)

    // if (ok) t.pass('Nearby obstruction')

    t.end()
})



test("correctness - doesn't go into collided wall", function (t) {
    var getVoxels = function (x, y, z) {
        if (x >= 10) return true
        if (x <= -11) return true
        return false
    }
    var box = new AABB([0, 0, 0], [1, 1, 1])
    var callback = function (dist, axis, dir, vec) {
        return true
        // vec[axis] = 0
    }
    var vec = []

    function test(dir) {
        for (var i=0; i<3; i++) {
            box.base[i] = Math.random()
            box.max[i] = box.base[i] + 1 + Math.random()
            vec[i] = 5 * Math.random()
        }
        vec[0] = dir ? 50 : -50
        var dist = sweep(getVoxels, box, vec, callback)
        return !(box.max[0] > 10 || box.base[0] < -10)
    }
    
    var ok = true
    for (var i = 0; i < N; i++) {
        ok = ok && test(i%2)
        if (!ok) {
            console.log('base', box.base)
            console.log('max', box.max)
            t.fail('Went beyond collision boundary on '+i+'th random test')
            break
        }
    }

    if (ok) t.pass('Passed ' + N + ' randomized sliding tests')

    t.end()
})



