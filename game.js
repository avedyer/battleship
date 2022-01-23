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

    function turn() {
        vertical = !vertical;
        if (coords.length === 0) {
            return
        }
        let newCoords = []
        let anchor = coords[0]
        for (let i=0; i<length; ++i) {
            newCoords[i] = vertical ? [anchor[0], anchor[1] + i] : [anchor[0] + i, anchor[1]];
        }
        writeCoords(newCoords);
    }

    function isVertical() {
        return vertical
    }
    function getLength() {
        return length
    }
    function getCoords() {
        return coords
    }

    function getHits() {
        return hits
    }

    function clearCoords() {
        coords.length = 0;
    }

    function writeCoords(newCoords) {
        for (let i=0; i<newCoords.length; ++i) {
            coords.splice(i, 1, newCoords[i]);
        }
    }

    return {
        hit,
        isSunk,
        getHits,
        isVertical,
        getLength,
        getCoords,
        clearCoords,
        writeCoords,
        turn
    }
}


const Board = () => {

    let attacks = [];
    let hits = [];
    let misses = [];
    let ships = [];
    let size = 10;

    function getShips() {
        return ships
    }

    function getHits() {
        return hits
    }

    function getMisses() {
        return misses
    }

    function getAttacks() {
        return attacks
    }

    function clearShips() {
        ships.length = 0;
    }

    const getSize = () => size

    function validateCoords(ship) {
        for (let i=0; i<ship.getLength(); ++i) {
            if (ship.getCoords()[i][0] >= size || ship.getCoords()[i][1] >= size) {
                return false
            }
        }
        return true
    }

    function validatePlacement(coords) {
        for (let i=0; i<coords.length; ++i) {
            for (const oldShip of ships) {
                for (const oldCoord of oldShip.getCoords()) {
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
        if (mockShip.isVertical() !== vertical) {
            mockShip.turn();
        }

        let coords = []

        for (let i=0; i<mockShip.getLength(); ++i) {
            coords[i] = mockShip.isVertical() ? [anchor[0], anchor[1] + i] : [anchor[0] + i, anchor[1]];
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

                mockShip = makeMockShip(anchor, ship.getLength(), vertical)
                --timeout
            }
            while(!validateCoords(mockShip) || !validatePlacement(mockShip.getCoords()));
            ship = mockShip
            placeShip(ship);

            if (timeout<0) {
                break
            }
        }
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
            for (let coord of ship.getCoords()) {
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
        getHits,
        getMisses,
        getShips,
        getSize,
        placeShip,
        receiveAttack,
        checkWin,
        validateCoords,
        validatePlacement,
        makeMockShip,
        clearShips,
        randomizeShips,
        getAttacks
    }
}

const Player = (name) => {

    let computer = false

    function isComputer() {
        return computer
    }

    function makeComputer() {
        computer = true
    }

    function evaluateTiles(gameboard) {

        //DOES NOT ACCOUNT FOR SHAPE OF SHIPS WITHOUT AN AVAILABLE HIT TO LEAD OFF FROM. SHOULD BE FIXED

        let tileValues = []
        let hits = gameboard.getHits();
        let sunkTiles = []
        let attacks = gameboard.getAttacks();

        for (let i=0; i< gameboard.getSize(); ++i) {
            let row = []
            for (let j=0; j<gameboard.getSize(); ++j) {
                row.push(0);
            }
            tileValues.push(row);
        }

        for (let ship of gameboard.getShips()) {
            if (ship.isSunk()) {
                for (let coords of ship.getCoords()) {
                    sunkTiles.push(coords);
                }
            }
        }
        
        for (let hit of hits) {

            let sunk = false;

            for (let sunkTile of sunkTiles) {
                if (sunkTile[0] === hit[0] && sunkTile[1] === hit[1]) {
                    sunk = true;
                    break
                }
            }

            if (!sunk) {
                for (let i=1; i<3; ++i) {
                    let adjacentTiles = [
                        [[hit[0] - i], [hit[1]]],
                        [[hit[0] + i], [hit[1]]],
                        [[hit[0]], [hit[1] - i]],
                        [[hit[0]], [hit[1] + i]]
                    ]

                    console.log(adjacentTiles);

                    for (let tile of adjacentTiles) {
                        if (tile && tileValues[tile[0]] && tileValues[tile[1]]) {
                            tileValues[tile[0]][tile[1]] += 2/i;
                        }
                    }
                }
            }
            tileValues[hit[0]][hit[1]] = 0
        }

        for (let attack of attacks) {
            tileValues[attack[0]][attack[1]]  = -1
        }

        return tileValues
    }

    const computeMove = (gameboard) => {

        let tileValues = evaluateTiles(gameboard);

        console.log(tileValues);

        let highValue = 0
        let highTiles = []

        for (let i=0; i<tileValues.length; ++i) {
            for (let j=0; j<tileValues.length; ++j) {
                if (tileValues[i][j] > highValue) {
                    highValue = tileValues[i][j]
                    highTiles.length = 0;
                    highTiles.push([i, j]);
                }

                else if (tileValues[i][j] === highValue) {
                    highTiles.push([i, j]);
                }
            }
        }

        console.log(highTiles);

        let attack = Math.floor(Math.random() * highTiles.length)
        console.log('automatic attack at ' + highTiles[attack])

        gameboard.receiveAttack(highTiles[attack]);  
        
    }

    return {
        makeComputer,
        isComputer,
        computeMove
    }
}

const Game = () => {

    let active = false
    let won = false

    const newShips = () => [Ship(2), Ship(3), Ship(3), Ship(4), Ship(5)]
    const newPlayers = () => [Player(), Player()];
    const newBoards = () => [Board(), Board()];

    let players = newPlayers()
    let boards = newBoards()

    players[1].makeComputer()

    for (let board of boards) {
        for (let ship of newShips()) {
            board.placeShip(ship);
        }
    }

    function getBoards() {
        return boards
    }

    const getPlayers = () => players

    let isWon = () => won

    function randomize() {
        for (const board of boards) {
            board.clearShips()
            board.randomizeShips(newShips());
        }
    }

    let activeIndex = 0
    let activeBoard = () => boards[activeIndex === 1 ? 0 : 1];
    let inactiveBoard = () => boards[activeIndex]
    let activePlayer = () => players[activeIndex]

    const checkWin = () => {
        if(activeBoard().checkWin()) {
            active = false
            return true
        }
        toggleTurn();
        return false
    }

    function toggleTurn() {
        activeIndex === 1 ? activeIndex = 0 : activeIndex = 1
        
    }


    function isActive() {
        return active
    }

    function start() {
        active = true
        activeIndex = 0;
    }

    function takeTurn(attack) {
        
        if(activePlayer().isComputer()) {
            activePlayer().computeMove(activeBoard());
            if(checkWin()) {
                won = true
            }
            return true
        }

        else {
            if(activeBoard().receiveAttack(attack)) {
                if(checkWin()) {
                    won = true
                }
                return true
            }
        }
        return false
    }

    //randomize()

    return {
        isActive,
        start,
        getBoards,
        activeBoard,
        inactiveBoard,
        checkWin,
        toggleTurn,
        newShips,
        randomize,
        isActive,
        takeTurn,
        isWon,
        activePlayer,
        getPlayers
    }
}

export {Ship, Board, Player, Game}