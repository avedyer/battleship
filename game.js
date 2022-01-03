const Ship = (length) => {

    let hits = [];
    let vertical = true;
    let coords = []

    function hit(position) {
        if (position > length || position < 1 || hits.includes(position)) {
            return false
        }
        hits.push(position);
        hits.sort((a, b) => a - b);

        return true
    }

    function isSunk() {
        for (let i=1; i<=length; ++i) {
            if (!hits.includes(i)) {
                return false
            }
            return true
        }
    }

    return {
        length,
        hits,
        coords,
        vertical,
        hit,
        isSunk
    }
}


const Board = () => {

    let attacks = [];
    let hits = [];
    let ships = [];
    let shipCoords = [];

    function placeShip(ship, coord) {
        ships.push(ship);
        for (let i=0; i<ship.length; ++i) {
            ship.coords.push(
                ship.vertical ? [coord[0], coord[1] + i] : [coord[0] + i, coord[1]]
            );
        }

    }

    function receiveAttack(attack) {
        if (attacks.includes(attack)) {
            return false
        }

        attacks.push(attack);
        
        for (let ship of ships) {
            for (let coord of ship.coords) {
                if (attack[0] === coord[0] && attack[1] === coord[1]) {
                    hits.push(attack);
                    ship.hit
                }
            }
        }

        return true

    }
    return {
        ships,
        attacks,
        hits,
        placeShip,
        receiveAttack
    }
}

export {Ship, Board}