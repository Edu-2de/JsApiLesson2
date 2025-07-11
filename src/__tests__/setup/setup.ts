jest.mock('../../database/connection', () => ({
  query: jest.fn(),
  connect: jest.fn(() => ({
    query: jest.fn(),
    release: jest.fn(),
  })),
}));


jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));


jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockedToken'),
  verify: jest.fn().mockReturnValue({ id: 1, email: 'test@test.com', role: 'user' }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});
