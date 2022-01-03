const Ship = (length) => {
    let hits = []

    function hit(position) {
        if (hits > length || hits < 0) {
            return false
        }
        hits.push(position);
        hits.sort((a, b) => a - b);

        return true
    }

    return {
        length,
        hits,
        hit
    }
}

export {Ship}