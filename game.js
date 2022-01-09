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

        let coords = []

        for (let i=0; i<ship.length; ++i) {
            coords.push (
                ship.vertical ? [coord[0], coord[1] + i] : [coord[0] + i, coord[1]]
            )
        }

        for (const oldShip of ships) {
            for (const newCoord of coords) {
                if (oldShip.coords.includes(newCoord)) {
                    return false
                }
            }
        }

        ship.coords = coords.slice(0);
        ships.push(ship);

        return true
    }

    function randomizeShips(ships) {

        let coords 

        for (let ship of ships) {            
            do {
                ship.vertical = Math.random < 0.5;
                coords = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
            }
            while(!placeShip(ship, coords));
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

    let players = [Player(), Player()];
        players[1].computer = true;
    let boards = [Board(), Board()];

    let shipSet = [Ship(2), Ship(3), Ship(3), Ship(4), Ship(5)]

    let liveBoard = boards[1]
    let livePlayer = players[0]

    const togglePlayer = () => {
        liveBoard = liveBoard === boards[1] ? boards[0] : boards[1];
        livePlayer = livePlayer === players[1] ? players[0] : players[1]
    }

    function takeTurn(coord) {
        if(liveBoard.receiveAttack(coord)){
            togglePlayer();
            return true
        }
        return false
    }


    return {
        players,
        boards,
        shipSet,
        takeTurn
    }
}

export {Ship, Board, Player, Game}