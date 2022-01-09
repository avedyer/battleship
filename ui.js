import {Ship, Board, Player, Game} from './game.js'

const body = document.querySelector('body');

function loadUI() {

    let game = Game()

    const gameContainer = document.createElement('div');
        gameContainer.classList.add('game')

    for (const board of game.boards) {

        const boardEl = document.createElement('div');
            boardEl.classList.add('board');

        for (let i=0; i<100; ++i) {
            const tileEl = document.createElement('div');
                tileEl.classList.add('tile');
                boardEl.append(tileEl);

                tileEl.onclick = () => {
                    const coord = [i%10, Math.floor(i/10)];
                    if(game.takeTurn(coord)); {
                        toggleBoards();
                    }
                }
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