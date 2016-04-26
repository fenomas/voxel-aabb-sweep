'use strict'

var test = require('tap').test

var sweep = require('../index')



test("basics", function (t) {

    var emptyVoxels = function (x, y, z) { return false }
    var fullVoxels = function (x, y, z) { return true }

    var box = {
        base: [0.25, 0.25, 0.25],
        max: [0.75, 0.75, 0.75],
    }
    var dir = [0, 0, 0]

    t.throws(function () { sweep(emptyVoxels, box, dir) }, 'Throws on empty direction vector')

    dir[1] = 1

    t.doesNotThrow(function () { sweep(emptyVoxels, box, dir) }, 'Works with non-empty direction vector')

    dir[1] = 10
    var dist
    dist = sweep(emptyVoxels, box, dir)

    t.ok(dist === dir[1], 'Moves full distance through empty voxels')

    dist = sweep(fullVoxels, box, dir)

    t.ok(dist === 0, 'Travels zero distance with full voxels')

    var voxelAtZero = function (x, y, z) { return x===0 && y===0 && z===0 }
    dist = sweep(voxelAtZero, box, dir)
    t.ok(dist === 0, 'Travels zero distance when AABB starts out obstructed')

    t.end()
})
