const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {
  get_num_locations,
  get_location_by_number,
  create_user,
  check_cred,
  get_user,
  check_name_availability,
  get_top_players,
  update_leaderboard,
  calculate_total_scores,
  delete_user
} = require('../db');

// Mock Mongoose models and methods
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    model: jest.fn().mockReturnValue({
      countDocuments: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
      aggregate: jest.fn(),
      save: jest.fn()
    })
  };
});

// Mock Bcrypt methods
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

describe('Database Functions', () => {

  beforeAll(async () => {
    mongoose.connect = jest.fn().mockResolvedValue(() => {});
    mongoose.disconnect = jest.fn().mockResolvedValue(() => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  // Tests for Location Functions
  it('should return the number of locations', async () => {
    const mockLocation = mongoose.model('Location');
    mockLocation.countDocuments.mockResolvedValue(10);
    const count = await get_num_locations();
    expect(count).toBe(10);
  });

  it('should return a location by number', async () => {
    const mockLocation = mongoose.model('Location');
    const mockDoc = { path: 'path1', long: 123, lat: 456 };
    mockLocation.findOne.mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockDoc)
    });
    const location = await get_location_by_number(0);
    expect(location).toEqual(mockDoc);
  });

  it('should check user credentials', async () => {
    bcrypt.compare.mockResolvedValue(true);
    const mockUser = mongoose.model('User');
    mockUser.findOne.mockResolvedValue({ password: 'hashedPassword' });

    const isValid = await check_cred('testUser', 'testPassword');
    expect(isValid).toBe(true);
  });

  it('should get a user', async () => {
    const mockUser = mongoose.model('User');
    const mockDoc = {
      username: 'testUser',
      high_score: 100,
      xp: 50
    };
    mockUser.findOne.mockResolvedValue(mockDoc);

    const user = await get_user('testUser');
    expect(user).toEqual(mockDoc);
  });

  // Additional tests for leaderboard, etc. can be added similarly
  it('should correctly calculate total scores and assign ranks', async () => {
    const mockLeaderboard = mongoose.model('Leaderboard');

    // Simulated aggregated leaderboard data
    const mockAggregatedData = [
      { _id: 'player1', total_score: 300 },
      { _id: 'player2', total_score: 250 },
      { _id: 'player3', total_score: 200 }
    ];

    // Mock the aggregate function to return our fake leaderboard data
    mockLeaderboard.aggregate.mockResolvedValue(mockAggregatedData);

    const result = await calculate_total_scores();

    expect(result).toEqual([
      { rank: 1, username: 'player1', total_score: 300 },
      { rank: 2, username: 'player2', total_score: 250 },
      { rank: 3, username: 'player3', total_score: 200 }
    ]);

    expect(mockLeaderboard.aggregate).toHaveBeenCalledTimes(1);
  });  

});
