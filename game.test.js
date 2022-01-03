import {Ship, Board} from './game.js'

it('Registers Hit', () => {

    let testShip = Ship(4);
    testShip.hit(2)

    expect(testShip.hits.includes(2))
    .toBe(true);
})

it('Deny invalid hit location', () => {
    let testShip = Ship(3);
    expect(testShip.hit(5))
    .toBe(false);
})

it('Sinks ship', () => {
    let testShip = Ship(4);

    for(let i=1; i<5; ++i) {
        testShip.hit(i);
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