// Get all rooms
/**
 * @swagger
 * /room:
 *   get:
 *     tags:
 *       - Room  # Ini menentukan bahwa endpoint ini berada di kategori "Room"
 *     summary: "Get all rooms"
 *     description: "Mendapatkan daftar semua kamar, termasuk informasi tipe, fasilitas, ulasan, keluhan, dan transaksi."
 *     responses:
 *       200:
 *         description: "Daftar kamar berhasil diambil."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data found"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *       404:
 *         description: "Tidak ada data ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Get room by ID
/**
 * @swagger
 * /room/{id}:
 *   get:
 *     tags:
 *       - Room  # Ini menentukan bahwa endpoint ini berada di kategori "Room"
 *     summary: "Get room by ID"
 *     description: "Mendapatkan informasi kamar berdasarkan ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID kamar"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Informasi kamar berhasil diambil."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: "Kamar tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Get room by type
/**
 * @swagger
 * /room/type/{id}:
 *  get:
 *   tags:
 *     - Room  # Ini menentukan bahwa endpoint ini berada di kategori "Room"
 *   summary: "Get room by type"
 *   description: "Mendapatkan daftar kamar berdasarkan tipe."
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: "ID tipe kamar"
 *       schema:
 *         type: string
 *   responses:
 *     200:
 *       description: "Daftar kamar berhasil diambil."
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Data found"
 *               data:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Room'
 *     404:
 *       description: "Tidak ada data ditemukan."
 *     500:
 *       description: "Terjadi kesalahan internal server."
 */

// Get room by user ID
/**
 * @swagger
 * /room/user/{id}:
 *   get:
 *     tags:
 *       - Room  # Ini menentukan bahwa endpoint ini berada di kategori "Room"
 *     summary: "Get room by user ID"
 *     description: "Mendapatkan daftar kamar berdasarkan ID pengguna."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID pengguna"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Daftar kamar berhasil diambil."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data found"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *       404:
 *         description: "Tidak ada data ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Create room
/**
 * @swagger
 * /room/add:
 *   post:
 *     tags:
 *       - Room  # Ini menentukan bahwa endpoint ini berada di kategori "Room"
 *     summary: "Create a new room"
 *     description: "Membuat kamar baru dengan informasi yang diberikan."
 *     security:
 *       - bearerAuth: []  # Autentikasi menggunakan JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ["available", "unavailable"]
 *               type:
 *                 type: array
 *                 items:
 *                   type: string
 *               reviews:
 *                 type: array
 *                 items:
 *                   type: string
 *               complaints:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: "Kamar berhasil dibuat."
 *       400:
 *         description: "Data tidak valid."
 *       500:
 *         description: "Terjadi kesalahan saat membuat kamar."
 */

// Update room by ID
/**
 * @swagger
 * /room/update/{id}:
 *   put:
 *     tags:
 *       - Room  # Ini menentukan bahwa endpoint ini berada di kategori "Room"
 *     summary: "Update room by ID"
 *     description: "Memperbarui informasi kamar berdasarkan ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID kamar"
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ["available", "unavailable"]
 *               type:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: "Kamar berhasil diperbarui."
 *       404:
 *         description: "Kamar tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan saat memperbarui kamar."
 */

// Delete room by ID
/**
 * @swagger
 * /room/delete/{id}:
 *   delete:
 *     tags:
 *       - Room  # Ini menentukan bahwa endpoint ini berada di kategori "Room"
 *     summary: "Delete room by ID"
 *     description: "Menghapus kamar berdasarkan ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID kamar"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Kamar berhasil dihapus."
 *       404:
 *         description: "Kamar tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan saat menghapus kamar."
 */

// Delete all rooms
/**
 * @swagger
 * /room/delete:
 *   delete:
 *     tags:
 *       - Room  # Ini menentukan bahwa endpoint ini berada di kategori "Room"
 *     summary: "Delete all rooms"
 *     description: "Menghapus semua kamar."
 *     responses:
 *       200:
 *         description: "Semua kamar berhasil dihapus."
 *       500:
 *         description: "Terjadi kesalahan saat menghapus semua kamar."
 */