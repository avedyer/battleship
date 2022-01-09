import {Ship, Board, Player, Game} from './game.js'

/*
it('Registers Hit', () => {

    let testShip = Ship(4);
    testShip.hit()

    expect(testShip.hits)
    .toBe(1);
})
*/

it('Sinks ship', () => {
    let testShip = Ship(4);

    for(let i=1; i<5; ++i) {
        testShip.hit();
    }

    expect(testShip.isSunk())
    .toBe(true);
})

it('Places Ship', () => {

    let testBoard = Board();
    let testShip = Ship(3)

    testBoard.placeShip(testShip, [4,3]);

    expect(testBoard.ships)
    .toStrictEqual([
        testShip
    ]);
});

it('Registers ship coordinates', () => {
    
    let testBoard = Board();
    let testShip = Ship(3);

    testBoard.placeShip(testShip, [3,6]);

    expect(testShip.coords)
    .toStrictEqual([
        [3,6],
        [3,7],
        [3,8]
    ]);
});

it('Receives Attack', () => {

    let testBoard = Board();

    testBoard.receiveAttack([4,6]);

    expect(testBoard.attacks)
    .toStrictEqual([[4,6]]);
});

it('Registers Hit', () => {

    let testBoard = Board();
    let testShip = Ship(3);

    testBoard.placeShip(testShip, [3,6]);
    testBoard.receiveAttack([3,8]);

    expect(testBoard.hits)
    .toStrictEqual([[3,8]]);

})

it('Registers Miss', () => {

    let testBoard = Board();
    let testShip = Ship(3);

    testBoard.placeShip(testShip, [3,6]);
    testBoard.receiveAttack([7,9]);


    expect(testBoard.misses)
    .toStrictEqual([[7,9]]);
})

it('Makes random attack', () => {

    let testBoard = Board();
    let testPlayer = Player()

    testBoard.receiveAttack([3,7]);
    testBoard.receiveAttack([0,2]);
    testBoard.receiveAttack([6,9]);

    testPlayer.computeMove(testBoard)

    expect(testBoard.misses.length)
    .toBe(4);
})

it('Registers Winstate', () => {

    let testBoard = Board();
    let testShip = Ship(3);

    testBoard.placeShip(testShip, [3,6]);
    testBoard.receiveAttack([3,8]);
    testBoard.receiveAttack([3,7]);
    testBoard.receiveAttack([3,6]);

    expect(testBoard.checkWin())
    .toBe(true);
})

it('Registers Non-Winstate', () => {

    let testBoard = Board();

    let testShip = Ship(3);
    let testShipTwo = Ship(4);

    testBoard.placeShip(testShip, [3,6]);
    testBoard.placeShip(testShipTwo, [1, 5]);
    testBoard.receiveAttack([3,8]);
    testBoard.receiveAttack([3,7]);
    testBoard.receiveAttack([3,6]);

    expect(testBoard.checkWin())
    .toBe(false);
})

it('Randomizes Ships', () => {

    let testGame = Game();

    testGame.boards[0].randomizeShips(testGame.shipSet)

    expect(testGame.boards[0].ships.length)
    .toBe(5)
})