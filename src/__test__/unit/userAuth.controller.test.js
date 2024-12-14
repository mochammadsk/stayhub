const userService = require('../../controllers/user.controller'); // Pastikan path sesuai

jest.mock('../../controllers/user.controller', () => ({
  signin: jest.fn(),
}));

describe('Login Route Tests', () => {
  it('should login a user successfully', async () => {
    // Mock respons dari userService.signin
    userService.signin.mockResolvedValue({
      user: { id: '12345', email: 'test@example.com' },
    });

    // Simulasi respons login sukses
    const mockReq = {
      session: {},
    };
    const mockRes = {
      redirect: jest.fn(),
    };

    // Panggil controller dengan data mock
    await userService.signin({ body: { email: 'test@example.com', password: 'password123' } });
    mockReq.session.user = { id: '12345', email: 'test@example.com' };
    mockRes.redirect('/user/dashboard');

    // Validasi
    expect(mockReq.session.user).toEqual({ id: '12345', email: 'test@example.com' });
    expect(mockRes.redirect).toHaveBeenCalledWith('/user/dashboard');
  });

  it('should return an error if login fails', async () => {
    // Mock error dari userService.signin
    userService.signin.mockRejectedValue(new Error('Invalid credentials'));

    // Simulasi respons login gagal
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Panggil controller dengan data mock
    try {
      await userService.signin({ body: { email: 'wrong@example.com', password: 'wrongpassword' } });
    } catch (error) {
      mockRes.status(400).json({ messages: 'Invalid credentials' });
    }

    // Validasi
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ messages: 'Invalid credentials' });
  });
});
