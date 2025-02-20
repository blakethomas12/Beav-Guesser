const { calculate_score } = require('../scoring'); // Update the path to your file

describe('calculate_score', () => {
    test('returns correct score for given coordinates', () => {
        // Test cases
        const testCases = [
            { true_x: 0, true_y: 0, user_x: 0, user_y: 0, expected: 5000 },
            { true_x: 0, true_y: 0, user_x: 781, user_y: 0, expected: 0 },
            { true_x: 100, true_y: 100, user_x: 200, user_y: 200, expected: 3353 },
            { true_x: 400, true_y: 400, user_x: 600, user_y: 600, expected: 2034 },
            { true_x: 500, true_y: 500, user_x: 500, user_y: 500, expected: 5000 }
        ];

        testCases.forEach(({ true_x, true_y, user_x, user_y, expected }) => {
            const result = calculate_score(true_x, true_y, user_x, user_y);
            expect(result).toBe(expected)
        });
    });
});
