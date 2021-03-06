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

    const activeSpace = () => document.querySelector('.playerSpace.active');
    const inactiveSpace = () => document.querySelector('.playerSpace:not(.active)');

    function load() {

        const gameContainer = document.createElement('div');
            gameContainer.classList.add('game');

        for (const board of boards) {
            const playerSpace = document.createElement('div');
                playerSpace.classList.add('playerSpace');

            let newBoard = BoardDisplay(board);

            let boardEl = newBoard.getBoard();
            let dockEl = newBoard.getDock();

            const gameHalf = document.createElement('div');
                gameHalf.classList.add('half')

            gameHalf.append(boardEl);
            boardDisplays.length > 0 ? gameHalf.append(dockEl) : gameHalf.prepend(dockEl);

            playerSpace.append(gameHalf);

            boardDisplays.push(newBoard);
            playerSpaces.push(playerSpace);

            gameContainer.append(playerSpace);
        }

        playerSpaces[0].classList.add('active');
        body.append(header(), gameContainer, lowerThird(), footer());

        boardDisplays[0].toggle();

        setupBoards();
    }

    function header() {
        let header = document.createElement('header');

        let nameOne = document.createElement('h1');
            nameOne.classList.add('name')
            nameOne.innerHTML = 'PLAYER';

        let nameTwo = document.createElement('h1');
            nameTwo.classList.add('name');
            nameTwo.innerHTML = 'COMPUTER';

        header.append(nameOne, nameTwo);


        return header
    }

    function lowerThird() {
        let lowerThird = document.createElement('div');
            lowerThird.classList.add('lowerThird');

        return lowerThird
    }

    function footer() {
        let footer = document.createElement('footer');

        return footer
    }

    const getElement = () => gameContainer

    function togglePlayer() {

        for(let i=0; i<2; ++i) {
            boardDisplays[i].toggle();
            playerSpaces[i].classList.toggle('active');
        }

        renderEllipsis();
    }

    function renderEllipsis() {
        let ellipsis = document.querySelector('.ellipsis');

        if (ellipsis) {
            ellipsis.parentElement.removeChild(ellipsis);
        }

        ellipsis = document.createElement('div');
            ellipsis.classList.add('ellipsis', 'caption');

        
        for (let i=0; i<3; ++i) {
            let dot = document.createElement('div');
            dot.classList.add('dot', 'blinking');

            if (i === 1) {
                dot.classList.add('delay1');
            }

            if (i === 2) {
                dot.classList.add('delay2')
            }

            ellipsis.append(dot);
        }

        if (game.isActive()) {
            console.log(inactiveSpace());
            inactiveSpace().append(ellipsis);            
        }
    }

    function setupBoards() {
        if (game.activeBoard().getShips()[0].getCoords().length !== 0) {
            console.log('starting')
            startGame();
            return
        }

        activeSpace().append(confirmButton());
    
        function confirmButton() {

            let confirmContainer = document.createElement('div');
                confirmContainer.classList.add('confirm', 'caption');

            let placementPrompt = document.createElement('h3');
                placementPrompt.innerHTML = game.activePlayer().isComputer() ? 'Computer is placing ships' : 'Place your ships!';
    
            let confirmButton = document.createElement('button');
                confirmButton.innerHTML = 'CONFIRM';
    
            confirmButton.onclick = () => {
    
                let ships = game.inactiveBoard().getShips();
    
                for (const ship of ships) {
                    if (ship.getCoords().length === 0) {
                        return false
                    }
                }
    
                game.toggleTurn();
                togglePlayer();
                confirmContainer.parentElement.removeChild(confirmContainer);    
    
                if (game.activePlayer().isComputer()) {
                    
                    const waitMessage = document.createElement('h3');
                        waitMessage.classList.add('caption');
                        waitMessage.innerHTML = 'Computing ship placements...';

                    activeSpace().append(waitMessage);

                    setTimeout(() => {
                        activeSpace().removeChild(waitMessage);
                        activeBoard().randomize();
                        setupBoards();
                    }, 2000);
                }
                else {
                    setupBoards();
                }
            }

            confirmContainer.append(placementPrompt, confirmButton);
            
            return confirmContainer
        }
    }

    function startGame() {

        for (let display of boardDisplays) {
            display.stripTileEvents();
            display.armTiles();
        }

        game.start()
        renderEllipsis()
    }

    function takeTurn(attack) {
        if (game.takeTurn(attack)) {

            activeBoard().renderAttacks();

            if(game.isWon()) {
                console.log('win!');
                displayWin();
            }

            else {

                togglePlayer();

                if (game.activePlayer().isComputer()) {
                    setTimeout(() => {
                        game.takeTurn();
                        activeBoard().renderAttacks();
                        togglePlayer();
                        
                        if(game.isWon()) {
                            console.log('win!');
                            displayWin();
                        }
            
                    }, Math.sqrt(Math.random()) * 2000);
                }
            }
        } 
    }

    function displayWin() {

        body.classList.add('shadowed');

        let caption = document.querySelector('.caption');   
            caption.parentNode.removeChild(caption);
        

        let winBanner = document.createElement('div');
            winBanner.classList.add('win');
        
            let announcement = document.createElement('div');
                announcement.classList.add('announcement');
                announcement.innerHTML = game.activePlayer().isComputer() ? 'Computer Wins!' : 'Player Wins!';

            let resetButton = document.createElement('button');
                resetButton.innerHTML = 'NEW GAME';
                resetButton.onclick = () => reset();
            

        winBanner.append(announcement, resetButton);
        
        body.append(winBanner);
    }

    function reset() {
        game = Game();

        boards = game.getBoards();
        boardDisplays = []
        playerSpaces = [];

        body.classList.remove('shadowed');
        body.innerHTML = '';

        load();
    }
    return {
        load,
        getBoards,
        getElement,
        activeBoard,
        inactiveBoard,
        setupBoards,
        togglePlayer,
        startGame,
        displayWin,
        takeTurn
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

        for (const ship of board.getShips()) {
            if (ship.isSunk()) {
                for (const coord of ship.getCoords()) {
                    tiles[coord[0]][coord[1]].classList.add('sunk')
                }
            }
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

                    else {
                        console.log('attack at ' + x, y);
                        UI.takeTurn([x, y]);
                    }
                }
            }
        }
    }

    function randomize() {
        console.log('randomizing');
        game.inactiveBoard().clearShips();
        game.inactiveBoard().randomizeShips(game.newShips());
    }

    function fillDock() {

        for (const ship of board.getShips()) {  

            const shipEl = document.createElement('div')
                shipEl.classList.add('ship', 'docked')

                for (let i=0; i<ship.getLength(); ++i) {
                    shipEl.append(document.createElement('div'));
                }

                shipEl.onclick = () => {
                    if (active && !game.isActive()) {
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
                                    if (!game.activePlayer().isComputer()) {
                                        renderShips();
                                    }
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

export {UI, game}