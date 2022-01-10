import {Ship, Board, Player, Game} from './game.js'

const body = document.querySelector('body');

function loadUI() {
    let game = Game()
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

            dock.append(shipEl);
        }

        playerSpace.append(boardEl);
        gameContainer.querySelectorAll('.playerSpace').length > 0 ? playerSpace.append(dock) : playerSpace.prepend(dock);
        gameContainer.append(playerSpace);

        uiBoards.push(tiles);
    }

    console.log(uiBoards);
    body.append(gameContainer);

}

export {loadUI}