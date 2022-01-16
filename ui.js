import {Ship, Board, Player, Game} from './game.js'

const body = document.querySelector('body');

function loadUI() {
    let game = Game();
    //game.randomize();

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
                        return
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

        for (const ship of board.getShips()) {  

            const shipEl = document.createElement('div')
                shipEl.classList.add('ship', 'docked')

                for (let i=0; i<ship.getLength(); ++i) {
                    shipEl.append(document.createElement('div'));
                }

                shipEl.onclick = () => {
                    console.log(ship.getCoords());
                    if (ship.getCoords().length === 0) {
                        selectShip(tiles, ship, board);
                    }
                } 

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

    for (const coord of ship.getCoords()) {
        tiles[coord[0]][coord[1]].classList.add('shadow');
    }
}

function stripHoverShip() {
    for (const tile of document.querySelectorAll('.tile')) {
        tile.classList.remove('shadow', 'reject');
    }
}

function renderShips(tiles, board) {
    for (const ship of board.getShips()) {
        for (const coord of ship.getCoords()) {
            tiles[coord[0]][coord[1]].classList.add('ship');
        }
    }
}

function renderAttacks(tiles, board) {
    for (const hit of board.getHits()) {
        tiles[hit[0]][hit[1]].classList.add('hit');
    }
    for (const miss of board.getMisses()) {
        tiles[miss[0]][miss[1]].classList.add('miss');
    }
}

function togglePlayer() {
    for( let playerSpace of document.querySelectorAll('.playerSpace')) {
        playerSpace.classList.toggle('active');
    }
}

function stripMouseoverEvents() {
    for (let tile of document.querySelectorAll('.tile')) {
        tile.onmouseover = () => {}
    }
}

function replaceShip(ship, board) {
    for (const oldShip of board.getShips()) {
        if (JSON.stringify(oldShip.getCoords()) === JSON.stringify(ship.getCoords())) {
            Object.assign(oldShip, ship);
            return true
        }
    }
    return false
}

function selectShip(tiles, ship, board) {

    console.log(ship)
    let mockShip = Ship();

    for (let i=0; i<tiles.length; ++i){

        for (let j=0; j<tiles[i].length; ++j) {

            tiles[i][j].onmouseover = () => {

                let anchor = [i, j];
                console.log(anchor)
                Object.assign(mockShip, board.makeMockShip(anchor, ship.getLength(), ship.isVertical()))

                if (board.validateCoords(mockShip) && board.validatePlacement(mockShip.getCoords())) {

                    hoverShip(tiles, mockShip);

                    let numClicks = 0;
                    let singleClickTimer
                    const handleClick = () => {
                        ++numClicks;
                        if (numClicks === 1) {
                            singleClickTimer = setTimeout(() => {
                                numClicks = 0;
                                Object.assign(ship, mockShip);
                                if (!replaceShip(ship, board)) {
                                    board.placeShip(ship)
                                }
                                renderShips(tiles, board);
                                stripMouseoverEvents()
                                Object.assign(mockShip, null)
                            }, 400);
                          }
                        else if (numClicks === 2) {
                            clearTimeout(singleClickTimer);
                            numClicks = 0;
                            ship.writeCoords(mockShip.getCoords());
                            console.log(ship.getCoords())
                            mockShip.turn();
                            ship.turn();
                            console.log(mockShip.isVertical(), mockShip.getCoords());
                        }
                    }

                    tiles[i][j].addEventListener('click', handleClick);
                }

                else {
                    tiles[i][j].classList.add('reject');
                }
            }

            tiles[i][j].addEventListener('mouseout', () => {
                stripHoverShip();
            })
        }
    }
}

export {loadUI}