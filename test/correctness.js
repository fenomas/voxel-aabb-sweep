'use strict'

var test = require('tap').test

var sweep = require('../index')
var brute = require('../reference/bruteForce')



test("correctness (unobstructed)", function (t) {

    // correct behavior when there's no objstruction
    var noVoxels = function () { return false }
    var box = {
        base: [0, 0, 0],
        max: [0, 0, 0],
    }
    var dir = [0, 0, 0]

    var hit1 = [0, 0, 0]
    var hit2 = [0, 0, 0]

    // comparisons
    var epsilon = 1e-5
    var equals = function (a, b) { return Math.abs(a - b) < epsilon }
    
    var N = 1000
    var ok

    for (var i = 0; i < N; i++) {
        randomizeInputs(box, dir)
        var sum = 0
        for (var j=0; j<3; j++) {
            hit2[j] = box.base[j] + dir[j]
            sum += dir[j] * dir[j]
        }
        var len = Math.sqrt(sum)

        // find results
        var d = sweep(noVoxels, box, dir, hit1)

        // compare
        ok = true
        ok = ok && equals(d, len)
        ok = ok && equals(hit1[0], hit2[0])
        ok = ok && equals(hit1[1], hit2[1])
        ok = ok && equals(hit1[2], hit2[2])

        if (!ok) {
            t.fail('Unobstructed results differed on ' + i + 'th test')
            break
        }
    }

    if (ok) t.pass('Passed ' + N + ' random correctness tests (unobstructed).')

    t.end()
})




test("correctness (obstructed)", function (t) {

    var fakeVoxel = function (x, y, z) {
        // always true outside radius = 15, always false inside r=10
        var dsq = x * x + y * y + z * z
        if (dsq > 15 * 15) return true
        if (dsq < 10 * 10) return false
        // else do whatever
        if (x % 3) return true
        if (y % 4) return true
        if (z % 2) return true
        return false
    }
    var box = {
        base: [0, 0, 0],
        max: [0, 0, 0],
    }
    var dir = [0, 0, 0]
    var d1 = 0
    var d2 = 0
    var hit1 = [0, 0, 0]
    var hit2 = [0, 0, 0]

    // comparisons
    var epsilon = 1e-3 // brute force does 1e5 iterations
    var equals = function (a, b) { return Math.abs(a - b) < epsilon }

    var N = 1000
    var ok

    for (var i = 0; i < N; i++) {
        randomizeInputs(box, dir)
        
        // find results
        d1 = sweep(fakeVoxel, box, dir, hit1)
        d2 = brute(fakeVoxel, box, dir, hit2)

        // compare
        ok = true
        ok = ok && equals(d1, d2)
        ok = ok && equals(hit1[0], hit2[0])
        ok = ok && equals(hit1[1], hit2[1])
        ok = ok && equals(hit1[2], hit2[2])

        if (!ok) {
            t.fail('Obstructed results differed on ' + i + 'th test')
            break
        }
    }

    if (ok) t.pass('Passed ' + N + ' random correctness tests (obstructed).')

    t.end()
})



function randomizeInputs(box, dir) {
    var lensq = 0
    for (var j = 0; j < 3; j++) {
        box.base[j] = 1 - 2 * Math.random()
        var size = 0.01 + 3 * Math.random()
        box.max[j] = box.base[j] + size
        dir[j] = 0.5 - Math.random()
        lensq += dir[j] * dir[j]
    }
    var len = Math.sqrt(lensq)
    for (j = 0; j < 3; j++) dir[j] *= 20 / len
}


