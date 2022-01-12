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

    function getCoords(anchor) {

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

    function validateCoords(ship) {
        for (let i=0; i<ship.length; ++i) {
            if (ship.coords[i][0] >= size || ship.coords[i][1] >= size) {
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

    function makeMockShip(anchor, length, vertical) {
        let mockShip = Ship(length);
        Ship.vertical = vertical;

        let coords = []

        for (let i=0; i<mockShip.length; ++i) {
            coords[i] = mockShip.vertical ? [anchor[0], anchor[1] + i] : [anchor[0] + i, anchor[1]];
        }

        mockShip.writeCoords(coords);

        return mockShip;
    }

    function placeShip(newShip) {

        ships.push(newShip);

        return true
    }

    function randomizeShips(newShips) {

        let anchor;
        let coords = [];
        let timeout = 10**8
        let mockShip

        for (let ship of newShips) {            
            do {

                anchor = [Math.floor(Math.random() * size), Math.floor(Math.random() * size)];
                coords = coords.splice(0, coords.length);
                let vertical = Math.random() < 0.5;

                mockShip = makeMockShip(anchor, ship.length, vertical)
                --timeout
            }
            while(!validateCoords(mockShip) || !validatePlacement(mockShip.coords));
            ship = mockShip
            placeShip(ship);

            if (timeout<0) {
                break
            }
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
        validateCoords,
        validatePlacement,
        makeMockShip,
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