let Ship = (length) => {

    let hits = 0;
    let vertical = true;
    let coords = []

    function hit() {
        if (hits < length) {
            ++hits;
        }
    }

    function isSunk() {
        return hits === length ? true : false
    }

    return {
        length,
        coords,
        vertical,
        hits,
        hit,
        isSunk
    }
}


const Board = () => {

    let attacks = [];
    let hits = [];
    let misses = [];
    let ships = [];

    function placeShip(ship, coord) {
        ships.push(ship);
        for (let i=0; i<ship.length; ++i) {
            ship.coords.push(
                ship.vertical ? [coord[0], coord[1] + i] : [coord[0] + i, coord[1]]
            );
        }

    }

    function receiveAttack(attack) {
        if (attacks.includes(attack) 
        || attack[0] < 0  || attack[1] < 0
        || attack[1] > 9 || attack[1] > 9) {
            return false
        }

        attacks.push(attack);
        
        for (let ship of ships) {
            for (let coord of ship.coords) {
                if (attack[0] === coord[0] && attack[1] === coord[1]) {
                    hits.push(attack);
                    ship.hit()

                    return true
                }
            }
        }
        
        misses.push(attack)

        return true

    }

    const checkWin = () => {
        for (const ship of ships) {
            if(!ship.isSunk()) {

                return false
            }
        }
        return true
    }

    return {
        ships,
        attacks,
        hits,
        misses,
        placeShip,
        receiveAttack,
        checkWin
    }
}

const Player = () => {

    let computer = false

    const computeMove = (gameboard) => {
        // Random coordinate selector. To be made smart later.

        let attack = [Math.floor(Math.random * 10), Math.floor(Math.random() * 10)]

        while(!gameboard.receiveAttack(attack)) {
            attack = [Math.floor(Math.random * 10), Math.floor(Math.random() * 10)]
            gameboard.receiveAttack(attack);
        }
    }

    return {
        computer,
        computeMove
    }
}

export {Ship, Board, Player}