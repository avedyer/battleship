import {Ship, Board, Player, Game} from './game.js'

const body = document.querySelector('body');

function loadUI() {

    let game = Game()

    const gameContainer = document.createElement('div');
        gameContainer.classList.add('game')

    for (const board of game.boards) {

        const boardEl = document.createElement('div');
            boardEl.classList.add('board');

        let tiles = []

        for (let i=0; i<100; ++i) {
            const tileEl = document.createElement('div');
                tileEl.classList.add('tile');

                tileEl.onclick = () => {
                    const coord = [Math.floor(i/10), i%10];
                    console.log(coord)
                    if (!tileEl.parentElement.classList.contains('active')) {
                        return false
                    }

                    if(game.takeTurn(coord)); {
                        toggleBoards();
                    }
                }

                tiles.push(tileEl)
                boardEl.append(tileEl);
        }

        let shipIndexes = []

        for (const ship of board.ships) {  
            for (const coord of ship.coords) {
                let index = (parseInt(coord[0]) * 10) + parseInt(coord[1]);
                shipIndexes.push(index);
            }
        }

        for (const index of shipIndexes) {
            tiles[index].classList.add('ship');
        }

        gameContainer.append(boardEl);
    }

    body.append(gameContainer);

    let boards = document.querySelectorAll('.board');
    boards[1].classList.add('active');
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
export {
    loadUI
}