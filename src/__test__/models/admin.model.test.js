const mongoose = require('mongoose');
const Admin = require('../../models/admin.model');
const argon2 = require('argon2'); // Import argon2

describe('Admin Model Test', () => {
  // Sebelum semua pengujian dimulai
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/stayhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Setelah semua pengujian selesai
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // Membersihkan koleksi sebelum setiap pengujian
  beforeEach(async () => {
    await Admin.deleteMany({});
  });

  describe('Validations', () => {
    it('should validate the admin schema', async () => {
      const admin = new Admin({
        userName: 'testAdmin',
        email: 'testadmin@example.com',
        password: 'password123',
      });

      const validationError = admin.validateSync();
      expect(validationError).toBeUndefined(); // Harus tidak ada error validasi
    });

    it('should throw validation error if userName is missing', async () => {
      const admin = new Admin({
        email: 'testadmin@example.com',
        password: 'password123',
      });

      const validationError = admin.validateSync();
      expect(validationError.errors.userName).toBeDefined(); // Harus ada error userName
    });

    it('should throw validation error if email is missing', async () => {
      const admin = new Admin({
        userName: 'testAdmin',
        password: 'password123',
      });

      const validationError = admin.validateSync();
      expect(validationError.errors.email).toBeDefined(); // Harus ada error email
    });

    it('should throw validation error if password is missing', async () => {
      const admin = new Admin({
        userName: 'testAdmin',
        email: 'testadmin@example.com',
      });

      const validationError = admin.validateSync();
      expect(validationError.errors.password).toBeDefined(); // Harus ada error password
    });
  });

  describe('Password Hashing', () => {
    it('should hash the password before saving', async () => {
      const admin = new Admin({
        userName: 'testAdmin',
        email: 'testadmin@example.com',
        password: 'password123',
      });

      await admin.save();
      const foundAdmin = await Admin.findOne({ email: 'testadmin@example.com' });
      
      // Verify password using argon2
      expect(await argon2.verify(foundAdmin.password, 'password123')).toBe(true); // Hash password check
    });

    it('should not hash password if not modified', async () => {
      const admin = new Admin({
        userName: 'testAdmin',
        email: 'testadmin@example.com',
        password: 'password123',
      });

      await admin.save();
      const hashBefore = admin.password;

      // Simulate not modifying password
      const admin2 = await Admin.findOne({ email: 'testadmin@example.com' });
      expect(admin2.password).toBe(hashBefore); // No hashing should occur
    });
  });
});
