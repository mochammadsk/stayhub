// Get review by ID
/**
 * @swagger
 * /review/{id}:
 *   get:
 *     tags:
 *       - Review
 *     summary: "Get reviews by the logged-in user by user ID"
 *     description: |
 *       Mengambil semua ulasan yang dibuat oleh user yang sedang login berdasarkan ID pengguna.
 *       Meskipun ID pengguna diberikan sebagai parameter path `{id}`, data sebenarnya
 *       diambil berdasarkan ID pengguna yang diautentikasi dari token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID pengguna (tidak mempengaruhi hasil karena autentikasi berbasis token)."
 *         schema:
 *           type: string
 *           example: "64c1f2abcde123"
 *     responses:
 *       200:
 *         description: "Daftar ulasan berhasil diambil."
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
 *                     $ref: '#/components/schemas/Review'
 *       404:
 *         description: "Tidak ada ulasan ditemukan untuk user ini."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */


// Create Review
/**
 * @swagger
 * /review/{id}:
 *   post:
 *     tags:
 *       - Review
 *     summary: "Create a review for a room by Room ID"
 *     description: "Membuat ulasan baru untuk kamar berdasarkan ID kamar."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari kamar yang akan direview"
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: "Rating untuk kamar (1-5)"
 *               comment:
 *                 type: string
 *                 description: "Komentar atau ulasan untuk kamar"
 *     responses:
 *       201:
 *         description: "Ulasan berhasil dibuat."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data created"
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: "User sudah memberi ulasan atau tidak berhak memberi ulasan."
 *       404:
 *         description: "Kamar tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Update Review
/**
 * @swagger
 * /review/{id}:
 *   put:
 *     tags:
 *       - Review
 *     summary: "Update a review by ID"
 *     description: "Mengubah rating dan komentar pada ulasan yang sudah ada."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari ulasan yang akan diubah"
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: "Rating untuk kamar (1-5)"
 *               comment:
 *                 type: string
 *                 description: "Komentar atau ulasan untuk kamar"
 *     responses:
 *       200:
 *         description: "Ulasan berhasil diubah."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data updated"
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: "User tidak berhak mengubah ulasan."
 *       404:
 *         description: "Ulasan tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Delete Review
/**
 * @swagger
 * /review/{id}:
 *   delete:
 *     tags:
 *       - Review
 *     summary: "Delete a review by ID"
 *     description: "Menghapus ulasan berdasarkan ID ulasan."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari ulasan yang akan dihapus"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Ulasan berhasil dihapus."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data deleted"
 *       404:
 *         description: "Ulasan tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */
