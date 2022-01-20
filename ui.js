import {Ship, Board, Player, Game} from './game.js'

const body = document.querySelector('body');
let game = Game();

const UI = (() => {

    let boards = game.getBoards();
    let boardDisplays = []
    let playerSpaces = [];

    const gameContainer = document.createElement('div');
        gameContainer.classList.add('game');

    const getBoards = () => boards

    const activeBoard = () => {
        for (let display of boardDisplays) {
            if (display.isActive()) {
                return display
            }
        }
    }

    const inactiveBoard = () => {
        for (let display of boardDisplays) {
            if (!display.isActive()) {
                return display
            }
        }
    }

    function load() {

        const gameContainer = document.createElement('div');
            gameContainer.classList.add('game')

        for (const board of boards) {
            const playerSpace = document.createElement('div');
                playerSpace.classList.add('playerSpace');

            let newBoard = BoardDisplay(board);

            let boardEl = newBoard.getBoard();
            let dockEl = newBoard.getDock();

            playerSpace.append(boardEl);
            boardDisplays.length > 0 ? playerSpace.append(dockEl) : playerSpace.prepend(dockEl);
            gameContainer.append(playerSpace);

            boardDisplays.push(newBoard);
            playerSpaces.push(playerSpace);

            gameContainer.append(playerSpace);
        }

        playerSpaces[0].classList.add('active');
        body.append(gameContainer);

        setupBoards();
    }

    const getElement = () => gameContainer

    function togglePlayer() {
        for(let i=0; i<2; ++i) {
            boardDisplays[i].toggle();
            playerSpaces[i].classList.toggle('active');
        }
    }

    function setupBoards() {

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
                        startGame();
                        return false
                    }
                }
    
                game.toggleTurn();
                togglePlayer();
                confirmButton.parentElement.removeChild(confirmButton);
    
                if (game.activePlayer().isComputer()) {
                    setTimeout(() => {activeBoard().randomize()}, 2000);
                    return
                }
    
                setupBoard();
            }
            
            return confirmButton
        }
    }

    function startGame() {

        for (let display of boardDisplays) {
            display.stripTileEvents();
            display.armTiles();
        }

        game.start()
    }

    function displayWin() {
        alert ('win detected')
    }

    return {
        load,
        getBoards,
        getElement,
        activeBoard,
        inactiveBoard,
        setupBoards,
        startGame,
        displayWin,
    }
})();


const BoardDisplay = (board) => {

    let tiles = []

    let boardEl = document.createElement('div');
        boardEl.classList.add('board');

    let dockEl = document.createElement('div');
        dockEl.classList.add('dock');
        fillDock();

    let active = false


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

    const getTiles = () => tiles
    const isActive = () => active
    const getBoard = () => boardEl
    const getDock = () => dockEl
    const getShips = () => board.getShips()

    const toggle = () => {
        active = !active
    }

    function hoverShip(ship) {
        for (const coord of ship.getCoords()) {
            tiles[coord[0]][coord[1]].classList.add('shadow');
        }
    }

    function stripHoverShip() {
        for(let i=0; i<tiles.length; ++i) {
            for (let j=0; j<tiles[i].length; ++j) {
                tiles[i][j].classList.remove('shadow', 'reject');
            }
        }
    }

    function highlightShip(ship) {
        for (const coord of ship.getCoords()) {
            tiles[coord[0]][coord[1]].classList.add('highlight');
        }
    }

    function stripHighlight(ship) {
        for (const coord of ship.getCoords()) {
            tiles[coord[0]][coord[1]].classList.remove('highlight');
        }
    }

    function clearBoard() {
        for(let i=0; i<tiles.length; ++i) {
            for (let j=0; j<tiles[i].length; ++j) {
                tiles[i][j].className = 'tile'
            }
        }
    }

    function renderShips() {
        clearBoard(tiles);
        for (const ship of board.getShips()) {
            for (const coord of ship.getCoords()) {
                tiles[coord[0]][coord[1]].classList.add('ship');
            }
        }
    }

    function replaceShip(ship) {
        for (const oldShip of board.getShips()) {
            if (JSON.stringify(oldShip.getCoords()) === JSON.stringify(ship.getCoords())) {
                Object.assign(oldShip, ship);
                renderShips()
                return true
            }
        }
        return false
    }

    function renderAttacks() {
        for (const hit of board.getHits()) {
            tiles[hit[0]][hit[1]].classList.add('hit');
        }
        for (const miss of board.getMisses()) {
            tiles[miss[0]][miss[1]].classList.add('miss');
        }
    }

    function stripTileEvents() {
        for(let i=0; i<tiles.length; ++i) {
            for (let j=0; j<tiles[i].length; ++j) {
                tiles[i][j].onmouseover = () => {}
                tiles[i][j].onclick = () => {}
            }
        }
    }

    function armTiles() {
        for (let x=0; x<10; ++x) {
            for (let y=0; y<10; ++y) {
                tiles[x][y].onclick = () => {
                    if (!active
                    || !game.isActive()) {
                        return false
                    }

                    else if(game.takeTurn([x, y])) {
                        if (game.isWon()) {
                            UI.activeBoard().renderAttacks();
                            UI.displayWin();
                            return
                        }
                        else {
                            UI.togglePlayer();
                            UI.inactiveBoard().renderAttacks()
                        }
                    }
                }
            }
        }
    }

    function randomize() {
        console.log('randomizing');
        game.activeBoard().clearShips();
        game.activeBoard().randomizeShips(game.newShips());
        renderShips();
    }

    function fillDock() {

        for (const ship of board.getShips()) {  

            const shipEl = document.createElement('div')
                shipEl.classList.add('ship', 'docked')

                for (let i=0; i<ship.getLength(); ++i) {
                    shipEl.append(document.createElement('div'));
                }

                shipEl.onclick = () => {
                    if (shipEl.parentElement.parentElement.classList.contains('active')
                    && !game.isActive()) {
                        selectShip(ship);
                    }
                }

                shipEl.onmouseover = () => {
                    highlightShip(ship);
                }

                shipEl.onmouseout = () => {
                    stripHighlight(ship);
                }

            dockEl.append(shipEl);
        }
    }

    function selectShip(ship) {

        if (ship.getCoords().length > 0) {
            ship.clearCoords();
            console.log(ship.getCoords())
            renderShips();
        }
    
        for (let i=0; i<tiles.length; ++i){
            for (let j=0; j<tiles[i].length; ++j) {
    
                tiles[i][j].onmouseover = () => {
    
                    if(game.isActive()) {
                        return false
                    }
    
                    let anchor = [i, j];
                    let mockShip =  board.makeMockShip(anchor, ship.getLength(), ship.isVertical());
    
                    if (board.validateCoords(mockShip) && board.validatePlacement(mockShip.getCoords())) {
    
                        hoverShip(mockShip);
    
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
                                    if (!replaceShip(ship)) {
                                        board.placeShip(ship);
                                    }
                                    renderShips();
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
    
    return {
        getTiles,
        getBoard,
        getDock,
        isActive,
        toggle,
        hoverShip,
        stripHoverShip,
        highlightShip,
        stripHighlight,
        clearBoard,
        renderShips,
        renderAttacks,
        stripTileEvents,
        randomize,
        armTiles,
        fillDock
    }
}

export {UI}