const mongoose = require('mongoose');
const Admin = require('../../models/admin.model');
const argon2 = require('argon2');

describe('Admin Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/stayhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Admin.deleteMany({});
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

      expect(foundAdmin.password).not.toBe('password123');
      expect(await argon2.verify(foundAdmin.password, 'password123')).toBe(true);
    });

    it('should handle error if password hashing fails', async () => {
      // Mock argon2.hash untuk memicu error
      const mockHash = jest.spyOn(argon2, 'hash').mockRejectedValue(new Error('Hashing failed'));

      const admin = new Admin({
        userName: 'testAdmin',
        email: 'testadmin@example.com',
        password: 'password123',
      });

      try {
        await admin.save(); // Ini harus memicu error karena mock rejected
      } catch (error) {
        // Memastikan error ditangani dan diteruskan
        expect(error.message).toBe('Hashing failed');
      } finally {
        mockHash.mockRestore(); // Reset mock setelah pengujian
      }
    });

    it('should skip hashing if password is not modified', async () => {
      // Buat admin baru dengan password
      const admin = new Admin({
        userName: 'testAdmin',
        email: 'testadmin@example.com',
        password: 'password123',
      });

      await admin.save(); // Simpan admin pertama kali
      const hashBefore = admin.password; // Simpan hash pertama kali

      // Update data userName tanpa mengubah password
      admin.userName = 'updatedAdmin';
      await admin.save(); // Simpan kembali admin

      const hashAfter = admin.password; // Ambil hash setelah penyimpanan kedua

      // Pastikan hash password tidak berubah
      expect(hashAfter).toBe(hashBefore);
    });


    it('should hash password when password is updated', async () => {
      const admin = new Admin({
        userName: 'testAdmin',
        email: 'testadmin@example.com',
        password: 'password123',
      });

      await admin.save();
      const hashBefore = admin.password;

      admin.password = 'newPassword123';
      await admin.save();

      const updatedAdmin = await Admin.findOne({ email: 'testadmin@example.com' });
      expect(updatedAdmin.password).not.toBe(hashBefore);
      expect(await argon2.verify(updatedAdmin.password, 'newPassword123')).toBe(true);
    });
  });

  describe('toJSON Method', () => {
    it('should modify the output of toJSON method', async () => {
      const admin = new Admin({
        userName: 'testAdmin',
        email: 'testadmin@example.com',
        password: 'password123',
      });

      await admin.save();
      const jsonAdmin = admin.toJSON();

      expect(jsonAdmin.id).toBeDefined();
      expect(jsonAdmin.__v).toBeUndefined();
      expect(jsonAdmin.userName).toBe('testAdmin');
      expect(jsonAdmin.email).toBe('testadmin@example.com');
    });
  });
});
