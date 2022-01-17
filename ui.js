import {Ship, Board, Player, Game} from './game.js'

const body = document.querySelector('body');
let game = Game();

function loadUI() {

    let uiBoards = []

    const gameContainer = document.createElement('div');
            gameContainer.classList.add('game');

    for (const board of game.getBoards()) {

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
                    if (shipEl.parentElement.parentElement.classList.contains('active')
                    && !game.isActive()) {
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

    renderShips(uiBoards[0], game.getBoards()[0]);
    renderShips(uiBoards[1], game.getBoards()[1]);

    document.querySelectorAll('.playerSpace')[0].classList.add('active');

    setupBoard()
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

function stripTileEvents() {
    for (let tile of document.querySelectorAll('.tile')) {
        tile.onmouseover = () => {}
        tile.onclick = () => {}
    }
}

function armTiles() {
    let boards = document.querySelectorAll('.board')
    for (let i=0; i<2; ++i) {
        let tileArr = boards[i].querySelectorAll('.tile');
        console.log(boards[i]);
        console.log(tileArr);
        let tileGrid = []

        for (let x=0; x<10; ++x) {
            let tileRow = []
            for (let y=0; y<10; ++y) {
                tileRow.push(tileArr[x*10 + y])
                tileArr[x*10 + y].onclick = () => {
                    if (!boards[i].parentElement.classList.contains('active')
                    || !game.isActive()) {
                        return false
                    }

                    else if(game.takeTurn([x, y])) {
                        if (game.isWon()) {
                            renderAttacks(tileGrid, game.activeBoard());
                            displayWin();
                            return
                        }
                        else {
                            togglePlayer();
                            renderAttacks(tileGrid, game.inactiveBoard());
                        }
                    }
                }
            }
            tileGrid.push(tileRow);
        }
    }
}

function displayWin() {
    alert('win detected!');
}

function replaceShip(tiles, ship, board) {
    for (const oldShip of board.getShips()) {
        if (JSON.stringify(oldShip.getCoords()) === JSON.stringify(ship.getCoords())) {
            Object.assign(oldShip, ship);
            renderShips(tiles, board)
            return true
        }
    }
    return false
}

function selectShip(tiles, ship, board) {

    for (let i=0; i<tiles.length; ++i){

        for (let j=0; j<tiles[i].length; ++j) {

            tiles[i][j].onmouseover = () => {

                if(game.isActive()) {
                    return false
                }

                let anchor = [i, j];
                let mockShip =  board.makeMockShip(anchor, ship.getLength(), ship.isVertical());

                if (board.validateCoords(mockShip) && board.validatePlacement(mockShip.getCoords())) {

                    hoverShip(tiles, mockShip);

                    let numClicks = 0;
                    let singleClickTimer
                    const handleClick = () => {
                        ++numClicks;
                        if (numClicks === 1) {
                            singleClickTimer = setTimeout(() => {
                                numClicks = 0;
                                stripTileEvents()
                                Object.assign(ship, mockShip);
                                Object.assign(mockShip, null)
                                if (!replaceShip(tiles, ship, board)) {
                                    board.placeShip(ship);
                                }
                                renderShips(tiles, board);
                            }, 400);
                          }
                        else if (numClicks === 2) {
                            clearTimeout(singleClickTimer);
                            numClicks = 0;
                            mockShip.turn();
                            ship.turn();
                        }
                    }

                    tiles[i][j].onclick = handleClick
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

function setupBoard() {

    if (game.activeBoard().getShips()[0].getCoords().length !== 0) {
        startGame()
        return
    }

    let activeSpace = document.querySelectorAll('.playerSpace.active');

    activeSpace[0].append(confirmButton());

    function confirmButton() {

        let confirmButton = document.createElement('button');
            confirmButton.innerHTML = 'confirm';

            confirmButton.classList.add('confirm')

        confirmButton.onclick = () => {

            let ships = game.activeBoard().getShips();

            for (const ship of ships) {
                if (ship.getCoords().length === 0) {
                    return false
                }
            }

            game.toggleTurn();
            togglePlayer();
            confirmButton.parentElement.removeChild(confirmButton);


            setupBoard();
        }
        
        return confirmButton
    }
}

function startGame() {
    game.start()
    stripTileEvents();
    armTiles();
}

export {loadUI}