const { calculate_score } = require('../scoring'); // Adjust the path to your file

// Test cases for calculate_score
describe('calculate_score', () => {
    test('returns 5000 for distances less than or equal to 5', () => {
        expect(calculate_score(44.56766730220258, -123.28959983789187, 44.56766730220258, -123.28959983789187)).toBe(5000);
    });

    test('returns correct score for distances greater than 5', () => {
        expect(calculate_score(44.56766730220258, -123.28959983789187, 44.55767469824912, -123.2896888691443)).toBeLessThan(5000);
        expect(calculate_score(44.56766730220258, -123.28959983789187, 44.55767469824912, -123.2896888691443)).toBeGreaterThan(0);
    });

    test('returns 0 for distances very far away', () => {
        expect(calculate_score(44.56766730220258, -123.28959983789187, 0, 0)).toBe(0);
    });

    test('handles edge case for rounding', () => {
        const result = calculate_score(44.564864, -123.278903, 44.564871, -123.278666);
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(5000);
    });
});
