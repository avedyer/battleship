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

    function writeCoords(newCoords) {
        for (let i=0; i<newCoords.length; ++i) {
            coords[i] = newCoords[i].slice();
        }
    }

    return {
        length,
        coords,
        vertical,
        hits,
        hit,
        isSunk,
        writeCoords
    }
}


const Board = () => {

    let attacks = [];
    let hits = [];
    let misses = [];
    let ships = [];
    let size = 10;

    function validateCoords(anchor, length, vertical) {
        for (let i=0; i<length; ++i) {
            let nextCoord = vertical ? anchor[1] + i : anchor[0] + i
            if (nextCoord >= size) {
                return false
            }
        }
        return true
    }

    function validatePlacement(coords) {
        for (let i=0; i<coords.length; ++i) {
            for (const oldShip of ships) {
                for (const oldCoord of oldShip.coords) {
                    if (coords[i][0] === oldCoord[0] && coords[i][1] === oldCoord[1]) {
                        return false
                    }
                }
            }
        }
        return true
    }

    function placeShip(newShip) {

        ships.push(newShip);

        return true
    }

    function randomizeShips(newShips) {

        let anchor;
        let coords = [];

        let timeout = 10**8

        for (let ship of newShips) {            
            do {

                anchor = [Math.floor(Math.random() * size), Math.floor(Math.random() * size)];
                coords = coords.splice(0, coords.length);
                ship.vertical = Math.random() < 0.5;

                for (let i=0; i<ship.length; ++i) {
                    coords[i] = ship.vertical ? [anchor[0], anchor[1] + i] : [anchor[0] + i, anchor[1]];
                }

                --timeout
            }
            while(!validateCoords(anchor, ship.length, ship.vertical) || !validatePlacement(coords));
            ship.writeCoords(coords);
            placeShip(ship);
        }
        console.log(ships);
    }

    function receiveAttack(attack) {

        for (const oldAttack of attacks) {
            if (oldAttack[0] === attack[0] && oldAttack[1] == attack[1]) {
                return false
            }
        }

        if (attack[0] < 0  || attack[1] < 0
        || attack[0] >= size || attack[1] >= size) {
            return false
        }

        attacks.push(attack);
        
        for (let ship of ships) {
            for (let coord of ship.coords) {
                if (attack[0] === coord[0] && attack[1] === coord[1]) {
                    hits.push(attack);
                    ship.hit()

                    console.log('Hit!');
                    return true
                }
            }
        }
        
        misses.push(attack)

        console.log('Miss!');
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
        checkWin,
        randomizeShips
    }
}

const Player = (name) => {

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
        name,
        computer,
        computeMove
    }
}

const Game = () => {

    const newShips = () => [Ship(2), Ship(3), Ship(3), Ship(4), Ship(5)]
    const newPlayers = () => [Player(), Player()];
    const newBoards = () => [Board(), Board()];

    let players = newPlayers()
    let boards = newBoards()

    function randomize() {
        for (const board of boards) {
            board.randomizeShips(newShips());
        }
    }

    let liveIndex = 1
    let liveBoard = () => boards[liveIndex];

    const checkWin = () => liveBoard().checkWin()

    function toggleTurn() {
        liveIndex === 1 ? liveIndex  = 0 : liveIndex = 1
    }


    return {
        players,
        boards,
        liveBoard,
        checkWin,
        toggleTurn,
        newShips,
        randomize
    }
}

export {Ship, Board, Player, Game}