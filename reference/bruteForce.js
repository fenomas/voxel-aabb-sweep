'use strict'


// slow, brute force implementation of sweep for verifying correct results


function sweep_impl(getVoxel,
    x0, y0, z0,
    x1, y1, z1,
    dx, dy, dz,
    max_d, hit_pos, hit_norm) {

    // move AABB along direction vector in very small steps looking for a collision

    var N = 1e5

    // leading corner in each axis
    var px = (dx > 0) ? x1 : x0
    var py = (dy > 0) ? y1 : y0
    var pz = (dz > 0) ? z1 : z0

    // stepping directions in each axis
    var stepx = max_d * dx / N
    var stepy = max_d * dy / N
    var stepz = max_d * dz / N

    // main loop
    var floor = Math.floor
    var ct = 0
    var currAxis = -1
    var steppedIndex = -1

    while (ct < N) {

        var voxel
        outer:
        for (var x = floor(x0); x < x1; x++) {
            for (var y = floor(y0); y < y1; y++) {
                for (var z = floor(z0); z < z1; z++) {
                    voxel = getVoxel(x, y, z)
                    if (voxel) break outer
                }
            }
        }

        if (voxel) {
            finish()

            return max_d * ct / N

        }

        // step along vector by d/N

        steppedIndex = -1

        while (steppedIndex === -1 && ct < N) {

            currAxis = (currAxis + 1) % 3
            if (currAxis === 0) ct++


            var prev, next
            if (currAxis === 0) {
                prev = floor(px)
                x0 += stepx
                x1 += stepx
                px += stepx
                next = floor(px)
            } else if (currAxis === 1) {
                prev = floor(py)
                y0 += stepy
                y1 += stepy
                py += stepy
                next = floor(py)
            } else if (currAxis === 2) {
                prev = floor(pz)
                z0 += stepz
                z1 += stepz
                pz += stepz
                next = floor(pz)
            }

            if (prev !== next) steppedIndex = currAxis

        }
    }

    // no voxel hit found
    steppedIndex = -1
    finish()

    return max_d


    function finish() {
        if (hit_pos) {
            hit_pos[0] = x0
            hit_pos[1] = y0
            hit_pos[2] = z0
        }
        if (hit_norm) {
            hit_norm[0] = hit_norm[1] = hit_norm[2] = 0
            if (steppedIndex === 0) hit_norm[0] = (dx > 0) ? -1 : 1
            if (steppedIndex === 1) hit_norm[1] = (dy > 0) ? -1 : 1
            if (steppedIndex === 2) hit_norm[2] = (dz > 0) ? -1 : 1
        }

    }

}




// conform inputs

function sweep(getVoxel, box, direction, hit_pos, hit_norm) {
    var bx = +box.base[0]
    var by = +box.base[1]
    var bz = +box.base[2]
    var mx = +box.max[0]
    var my = +box.max[1]
    var mz = +box.max[2]

    var dx = +direction[0]
    var dy = +direction[1]
    var dz = +direction[2]
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

    if (dist === 0) {
        throw new Error("Can't sweep along a zero vector")
    }

    dx /= dist
    dy /= dist
    dz /= dist

    return sweep_impl(
        getVoxel,
        bx, by, bz,
        mx, my, mz,
        dx, dy, dz, dist,
        hit_pos, hit_norm
    )
}

module.exports = sweep

