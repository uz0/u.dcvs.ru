const cnb = require('../cowsAndBulls.command');

const testData = [
    [
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [4, 0],
    ],
    [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [0, 0],
    ],
    [
        [1, 2, 3, 4],
        [2, 1, 4, 3],
        [0, 4],
    ],
    [
        [1, 2, 3, 4],
        [1, 2, 4, 3],
        [2, 2],
    ],
    [
        [1, 2, 3, 4],
        [2, 5, 6, 7],
        [0, 1],
    ],
    [
        [1, 1, 1, 1],
        [1, 2, 3, 4],
        [1, 0],
    ],
    [
        [1, 1, 2, 2],
        [1, 3, 3, 2],
        [2, 0],
    ],
    [
        [1, 1, 2, 2],
        [1, 3, 1, 3],
        [1, 1],
    ],
];

describe('cnb', () => {
    test.each(testData)(
        'checkAnswer(%i, %i)',
        (target, answer, result) => {
            expect(cnb(target, answer)).toEqual(expect.arrayContaining(result));
        },
    );
});
