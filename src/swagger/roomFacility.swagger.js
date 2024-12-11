// Get all facilities
/**
 * @swagger
 * /facility:
 *   get:
 *     tags:
 *       - Facility  # Menentukan bahwa endpoint ini berada di kategori "Facility"
 *     summary: "Get all facilities"
 *     description: "Mendapatkan daftar semua fasilitas kamar."
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Daftar fasilitas berhasil diambil."
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
 *                     $ref: '#/components/schemas/FacilityRoom'
 *       404:
 *         description: "Tidak ada fasilitas ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Get facility by ID
/**
 * @swagger
 * /facility/{id}:
 *   get:
 *     tags:
 *       - Facility  # Menentukan bahwa endpoint ini berada di kategori "Facility"
 *     summary: "Get facility by ID"
 *     description: "Mendapatkan informasi fasilitas berdasarkan ID."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID fasilitas"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Fasilitas berhasil diambil."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FacilityRoom'
 *       404:
 *         description: "Fasilitas tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Create a new facility
/**
 * @swagger
 * /facility/add:
 *   post:
 *     tags:
 *       - Facility  # Menentukan bahwa endpoint ini berada di kategori "Facility"
 *     summary: "Create a new facility"
 *     description: "Membuat fasilitas baru."
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Wi-Fi"
 *     responses:
 *       201:
 *         description: "Fasilitas berhasil dibuat."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FacilityRoom'
 *       409:
 *         description: "Fasilitas dengan nama yang sama sudah ada."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Update facility by ID
/**
 * @swagger
 * /facility/update/{id}:
 *   put:
 *     tags:
 *       - Facility  # Menentukan bahwa endpoint ini berada di kategori "Facility"
 *     summary: "Update facility by ID"
 *     description: "Memperbarui fasilitas berdasarkan ID."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID fasilitas"
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
 *                 example: "Updated Wi-Fi"
 *     responses:
 *       200:
 *         description: "Fasilitas berhasil diperbarui."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FacilityRoom'
 *       404:
 *         description: "Fasilitas tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */


// Delete facility by ID
/**
 * @swagger
 * /facility/delete/{id}:
 *   delete:
 *     tags:
 *       - Facility  # Menentukan bahwa endpoint ini berada di kategori "Facility"
 *     summary: "Delete facility by ID"
 *     description: "Menghapus fasilitas berdasarkan ID."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID fasilitas"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Fasilitas berhasil dihapus."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FacilityRoom'
 *       404:
 *         description: "Fasilitas tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Delete all facilities
/**
 * @swagger
 * /facility/delete:
 *   delete:
 *     tags:
 *       - Facility  # Menentukan bahwa endpoint ini berada di kategori "Facility"
 *     summary: "Delete all facilities"
 *     description: "Menghapus semua fasilitas."
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Semua fasilitas berhasil dihapus."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All data deleted"
 *       404:
 *         description: "Tidak ada fasilitas ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */