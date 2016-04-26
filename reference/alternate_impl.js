'use strict'

function sweep_impl(getVoxel,
	xbase, ybase, zbase,
	xmax, ymax, zmax,
	dx, dy, dz,
	max_d, hit_pos, hit_norm) {

	// consider algo as a raycast along the AABB's leading corner
	// as raycast enters each new voxel, iterate in 2D over the AABB's 
	// leading face in that axis looking for collisions
	// 
	// original raycast implementation: https://github.com/andyhall/fast-voxel-raycast
	// original raycast algorithm: http://www.cse.chalmers.se/edu/year/2010/course/TDA361/grid.pdf

	var floor = Math.floor

	// parametrization t along raycast
	var t = 0.0

	// coords of leading corner in each axis
	var px = (dx > 0) ? xmax : xbase
	var py = (dy > 0) ? ymax : ybase
	var pz = (dz > 0) ? zmax : zbase

	// integer coord of leading corner
	var ix = floor(px) | 0
	var iy = floor(py) | 0
	var iz = floor(pz) | 0

	// float coords of trailing corner in each axis
	var tx = (dx > 0) ? xbase : xmax
	var ty = (dy > 0) ? ybase : ymax
	var tz = (dz > 0) ? zbase : zmax

	// size
	var sizex = xmax - xbase
	var sizey = ymax - ybase
	var sizez = zmax - zbase

	// stepping directions in each axis
	var stepx = (dx > 0) ? 1 : -1
	var stepy = (dy > 0) ? 1 : -1
	var stepz = (dz > 0) ? 1 : -1

	// distance along t required to move one voxel in each axis
	// note dx,dy,dz are already normalized
	var txDelta = Math.abs(1 / dx)
	var tyDelta = Math.abs(1 / dy)
	var tzDelta = Math.abs(1 / dz)


	// location of nearest voxel boundary, in units of t 
	var xdist = (stepx > 0) ? (ix + 1 - px) : (px - ix)
	var ydist = (stepy > 0) ? (iy + 1 - py) : (py - iy)
	var zdist = (stepz > 0) ? (iz + 1 - pz) : (pz - iz)

	var txMax = (txDelta < Infinity) ? txDelta * xdist : Infinity
	var tyMax = (tyDelta < Infinity) ? tyDelta * ydist : Infinity
	var tzMax = (tzDelta < Infinity) ? tzDelta * zdist : Infinity

	var steppedIndex = -1
	
	
	
	// trying out an alternate implementatin that abstracts the 
	// axes through arrays
	
	// results: not significantly faster or slower, but probably harder to read.
	
	
	var step = step_arr
	step[0] = stepx
	step[1] = stepy
	step[2] = stepz
	
	var coords = coords_arr
	
	var lead = lead_arr
	lead[0] = ix
	lead[1] = iy
	lead[2] = iz
	
	var trail = trail_arr

	// main loop along raycast vector
	while (t <= max_d) {

		// exit check - loop over 2d face of voxels in the stepped axis

		if (steppedIndex > -1) {

			trail[0] = tx + t * dx
			trail[1] = ty + t * dy
			trail[2] = tz + t * dz

			var i_axis = steppedIndex
			var j_axis = (steppedIndex + 1) % 3
			var k_axis = (steppedIndex + 2) % 3

			coords[i_axis] = lead[i_axis]

			var stepj = step[j_axis]
			var j0 = Math.floor(trail[j_axis])
			var j1 = lead[j_axis] + stepj

			var stepk = step[k_axis]
			var k0 = Math.floor(trail[k_axis])
			var k1 = lead[k_axis] + stepk

			var voxel


			outer:
			for (var j = j0; j !== j1; j += stepj) {
				coords[j_axis] = j
				for (var k = k0; k !== k1; k += stepk) {
					coords[k_axis] = k
					voxel = getVoxel(coords[0], coords[1], coords[2])
					if (voxel) break outer
				}
			}


			if (voxel) {
				// exit case
				if (hit_pos) {
					hit_pos[0] = xbase + t * dx
					hit_pos[1] = ybase + t * dy
					hit_pos[2] = zbase + t * dz
				}
				if (hit_norm) {
					hit_norm[0] = hit_norm[1] = hit_norm[2] = 0
					if (steppedIndex === 0) hit_norm[0] = -stepx
					if (steppedIndex === 1) hit_norm[1] = -stepy
					if (steppedIndex === 2) hit_norm[2] = -stepz
				}
				return t
			}

		}

		// advance t to next nearest voxel boundary
		if (txMax < tyMax) {
			if (txMax < tzMax) {
				ix += stepx
				t = txMax
				txMax += txDelta
				steppedIndex = 0
				lead[0] = ix
			} else {
				iz += stepz
				t = tzMax
				tzMax += tzDelta
				steppedIndex = 2
				lead[2] = iz
			}
		} else {
			if (tyMax < tzMax) {
				iy += stepy
				t = tyMax
				tyMax += tyDelta
				steppedIndex = 1
				lead[1] = iy
			} else {
				iz += stepz
				t = tzMax
				tzMax += tzDelta
				steppedIndex = 2
				lead[2] = iz
			}
		}

	}

	// no voxel hit found
	if (hit_pos) {
		hit_pos[0] = px + t * dx
		hit_pos[1] = py + t * dy
		hit_pos[2] = pz + t * dz
	}
	if (hit_norm) {
		hit_norm[0] = hit_norm[1] = hit_norm[2] = 0
	}

	return max_d

}


var step_arr = new Int8Array(3)
var lead_arr = new Int16Array(3)
var trail_arr = new Float32Array(3)
var coords_arr = new Int16Array(3)


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

