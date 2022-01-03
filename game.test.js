import {Ship} from './game.js'

it('Register Hit', () => {

    let testShip = Ship(4);
    testShip.hit(2)

    expect(testShip.hits.includes(2))
    .toBe(true);
})