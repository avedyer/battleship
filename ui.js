import {Ship, Board, Player, Game} from './game.js'

const body = document.querySelector('body');

function loadUI() {
    let game = Game();
    game.randomize();

    let uiBoards = []

    const gameContainer = document.createElement('div');
            gameContainer.classList.add('game');

    for (const board of game.boards) {

        const playerSpace = document.createElement('div');
            playerSpace.classList.add('playerSpace');

        const dock = document.createElement('div');
            dock.classList.add('dock')

        const boardEl = document.createElement('div');
            boardEl.classList.add('board');

        let tiles = [];

        for (let i=0; i<10; ++i) {
            let row = []
            for (let j=0; j<10; ++j) {
                const tileEl = document.createElement('div');
                    tileEl.classList.add('tile');

                    tileEl.onclick = () => {
                        if (!tileEl.parentElement.parentElement.classList.contains('active')){
                            return false
                        }
                        if(board.receiveAttack([i, j])){
                            renderAttacks(tiles, board);
                            if (!board.checkWin()) {
                                togglePlayer();
                                return true
                            }
                            alert('win detected!');
                            return true

                        }
                    }

                row.push(tileEl)
                boardEl.append(tileEl);
            }
            tiles.push(row);
        }

        for (const ship of game.newShips()) {  

            const shipEl = document.createElement('div')
                shipEl.classList.add('ship', 'docked')

                for (let i=0; i<ship.length; ++i) {
                    shipEl.append(document.createElement('div'));
                }

                shipEl.onclick = () => placeShip(tiles, ship, board);

            dock.append(shipEl);
        }

        playerSpace.append(boardEl);
        gameContainer.querySelectorAll('.playerSpace').length > 0 ? playerSpace.append(dock) : playerSpace.prepend(dock);
        gameContainer.append(playerSpace);

        uiBoards.push(tiles);
    }

    body.append(gameContainer);

    renderShips(uiBoards[0], game.boards[0]);
    renderShips(uiBoards[1], game.boards[1]);

    document.querySelectorAll('.playerSpace')[0].classList.add('active');
}

function hoverShip(tiles, ship) {
    for (const coord of ship.coords) {
        tiles[coord[0]][coord[1]].classList.add('shadow');
    }
}

function stripHoverShip() {
    for (const tile of document.querySelectorAll('.tile')) {
        tile.classList.remove('shadow')
    }
}

function renderShips(tiles, board) {
    for (const ship of board.ships) {
        for (const coord of ship.coords) {
            tiles[coord[0]][coord[1]].classList.add('ship');
        }
    }
}

function renderAttacks(tiles, board) {
    for (const hit of board.hits) {
        tiles[hit[0]][hit[1]].classList.add('hit');
    }
    for (const miss of board.misses) {
        tiles[miss[0]][miss[1]].classList.add('miss');
    }
}

function togglePlayer() {
    for( let playerSpace of document.querySelectorAll('.playerSpace')) {
        playerSpace.classList.toggle('active');
    }
}

function placeShip(tiles, ship, board) {
    for (let i=0; i<tiles.length; ++i){
        for (let j=0; j<tiles[i].length; ++j) {
            tiles[i][j].addEventListener('mouseover', () => {
                ship.coords = [i, j];
                hoverShip(tiles, ship);
            })
            tiles[i][j].addEventListener('mouseout', () => {
                stripHoverShip();
            })
        }
    }
}

export {loadUI}