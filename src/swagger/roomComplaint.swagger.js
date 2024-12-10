// Get all complaints
/**
 * @swagger
 * /complaint:
 *   get:
 *     tags:
 *       - Complaint
 *     summary: "Get all complaints"
 *     description: "Mendapatkan daftar semua keluhan. Hanya admin yang bisa mengaksesnya."
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Daftar keluhan berhasil diambil."
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
 *                     $ref: '#/components/schemas/Complaint'
 *       401:
 *         description: "Unauthorized. Admin diperlukan untuk mengakses data keluhan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Get complaint by ID
/**
 * @swagger
 * /complaint/{id}:
 *   get:
 *     tags:
 *       - Complaint
 *     summary: "Get complaint by ID"
 *     description: "Mendapatkan informasi keluhan berdasarkan ID. Admin atau pengguna yang membuat keluhan dapat mengaksesnya."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID keluhan"
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Keluhan berhasil diambil."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Complaint'
 *       404:
 *         description: "Keluhan tidak ditemukan."
 *       401:
 *         description: "Unauthorized. Admin atau user yang membuat keluhan harus mengaksesnya."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Create complaint
/**
 * @swagger
 * /complaint/{id}:
 *   post:
 *     tags:
 *       - Complaint
 *     summary: "Create a new complaint"
 *     description: "Membuat keluhan baru terkait dengan kamar yang diberikan."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID kamar yang terkait dengan keluhan"
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Complaint'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: "Keluhan berhasil dibuat."
 *       400:
 *         description: "Permintaan tidak valid."
 *       401:
 *         description: "Unauthorized. Pengguna yang valid diperlukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Update complaint by ID
/**
 * @swagger
 * /complaint/{id}:
 *   put:
 *     tags:
 *       - Complaint
 *     summary: "Update complaint by ID"
 *     description: "Mengupdate keluhan berdasarkan ID. Hanya pengguna yang membuat keluhan atau admin yang dapat mengupdate."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID keluhan"
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Complaint'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Keluhan berhasil diupdate."
 *       400:
 *         description: "Permintaan tidak valid."
 *       401:
 *         description: "Unauthorized. Hanya pengguna yang valid yang dapat mengupdate keluhan mereka."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Delete complaint by ID
/**
 * @swagger
 * /complaint/{id}:
 *   delete:
 *     tags:
 *       - Complaint
 *     summary: "Delete complaint by ID"
 *     description: "Menghapus keluhan berdasarkan ID. Hanya pengguna yang membuat keluhan atau admin yang dapat menghapus."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID keluhan"
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Keluhan berhasil dihapus."
 *       404:
 *         description: "Keluhan tidak ditemukan."
 *       401:
 *         description: "Unauthorized. Hanya pengguna yang valid atau admin yang dapat menghapus keluhan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */