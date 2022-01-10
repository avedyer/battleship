import {Ship, Board, Player, Game} from './game.js'

const body = document.querySelector('body');

function loadUI() {

    let game = Game()
    
    const gameContainer = document.createElement('div');
        gameContainer.classList.add('game')

    for (const board of game.boards) {

        const dock = document.createElement('div');
            dock.classList.add('dock')

        const boardEl = document.createElement('div');
            boardEl.classList.add('board');

        let tiles = []

        for (let i=0; i<100; ++i) {
            const tileEl = document.createElement('div');
                tileEl.classList.add('tile');

                /*tileEl.onclick = () => {
                    const coord = [Math.floor(i/10), i%10];
                    if (!tileEl.parentElement.classList.contains('active')) {
                        return false
                    }

                    if(game.takeTurn(coord)); {
                        for (const hit of game.liveBoard().hits) {
                            console.log('hit: ' + hit);
                            if (hit[0] === coord[0] && hit[1] === coord[1]) {
                                
                                tileEl.classList.add('hit')
                            }
                        }
                        for (const miss of game.liveBoard().misses) {
                            console.log('miss: ' + miss)
                            if (miss[0] === coord[0] && miss[1] === coord[1]) {
                                tileEl.classList.add('miss')
                            }
                        }
                        
                        if (game.checkWin()) {
                            alert('Win Detected');
                            return
                        }

                        game.toggleTurn();
                        toggleBoards();
                    }
                }
                */

                tiles.push(tileEl)
                boardEl.append(tileEl);
        }

        let shipIndexes = []

        for (const ship of board.ships) {  
            for (const coord of ship.coords) {
                let index = (parseInt(coord[0]) * 10) + parseInt(coord[1]);
                shipIndexes.push(index);
            }

            const shipEl = document.createElement('div')
                shipEl.classList.add('ship', 'docked')

                for (let i=0; i<ship.length; ++i) {
                    shipEl.append(document.createElement('div'));
                }

                shipEl.onclick = () => {

                    if (boardEl.classList.contains('active')){
                        placeShip(ship);
                    }
                    /*
                    selectedShip = ship;
                    for (let i=0; i< tiles.length; ++i) {
                        if (!tiles[i].parentElement.classList.contains('active')) {
                            return false
                        }
                        tiles[i].addEventListener('mouseover', () => {
                            
                            for (let j=0; j<selectedShip.length; ++j) {
                                let shadow = selectedShip.vertical ? tiles[i - (j*10)] : tiles[i + j];
                                shadow.classList.add('shadow');
                            }
                            
                            tiles[i].classList.add('shadow');
                        })
                        tiles[i].addEventListener('mouseout', () => {
                            for (const shadow of document.querySelectorAll('.shadow')) {
                                shadow.classList.remove('shadow');
                            }
                        })
                    }*/
                }
            dock.append(shipEl);
        }

        for (const index of shipIndexes) {
            tiles[index].classList.add('ship');
        }

        gameContainer.append(boardEl);
        gameContainer.querySelectorAll('.board').length > 1 ? gameContainer.append(dock) : gameContainer.prepend(dock)
    }

    body.append(gameContainer);

    let boards = document.querySelectorAll('.board');
    boards[0].classList.add('active');
}


function toggleBoards () {
    let boards = document.querySelectorAll('.board')

    for (let board of boards) {
        if (board.classList.contains('active')){
            board.classList.remove('active');
        }
        else {
            board.classList.add('active');
        }
    }
}

function placeShip(ship) {

    let tiles = document.querySelector('.board.active').querySelectorAll('.tile');

    for (let i=0; i<tiles.length; ++i) {
        tiles[i].addEventListener('mouseover', () => {

            const coord = [Math.floor(i/10), i%10]
            let coords = [];

            for (let j=0; j<ship.length; ++j) {
                console.log((i%10) + j, Math.floor(i/10) + j)
                if (ship.vertical && (Math.floor(i/10), i%10) + j > 9 || !ship.vertical && i%10 + j > 9) {
                    break
                }
                coords.push(
                ship.vertical ? [coord[0], coord[1] + j] : [coord[0] + j, coord[1]]
                )

                let shadow = ship.vertical ? tiles[i - (j*10)] : tiles[i+j];
                shadow.classList.add('shadow');
            }

            tiles[i].addEventListener('dblclick', () => {
                console.log('double click')
                ship.vertical = !ship.vertical
            }) 
        })

        tiles[i].addEventListener('mouseout', () => {
            for (const shadow of document.querySelectorAll('.shadow')) {
                shadow.classList.remove('shadow');
            }
        });
    }
}
export {
    loadUI
}