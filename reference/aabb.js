
module.exports = AABB


// minimal reproduction of https://github.com/andyhall/aabb-3d


function AABB(base, max) {
    this.base = []
    this.max = []
    for (var i=0; i<3; i++) {
        this.base[i] = base[i]
        this.max[i] = max[i]
    }
}


AABB.prototype.translate = function(vec) {
    for (var i=0; i<3; i++) {
        this.base[i] += vec[i]
        this.max[i] += vec[i]
    }
}


AABB.prototype.setPosition = function(vec) {
    for (var i=0; i<3; i++) {
        vec[i] = vec[i] - this.base[i]
    }
    this.translate(vec)
}

