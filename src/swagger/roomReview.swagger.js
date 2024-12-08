// Get reviews for a room
/**
 * @swagger
 * /review/{id}:
 *   get:
 *     tags:
 *       - Review
 *     summary: "Get reviews for a room by ID"
 *     description: "Mengambil semua ulasan untuk sebuah kamar."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari kamar yang ingin dilihat ulasannya"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Daftar ulasan untuk kamar berhasil diambil."
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
 *         description: "Kamar tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */



// Create Review
/**
 * @swagger
 * /review/{id}:
 *   post:
 *     tags:
 *       - Review  # Menentukan kategori "Review"
 *     summary: "Create a review for a room by Room ID"  # Deskripsi singkat endpoint
 *     description: "Membuat ulasan baru untuk kamar berdasarkan rating dan komentar yang diberikan oleh pengguna."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari kamar yang akan direview"
 *         schema:
 *           type: string
 *       - in: body
 *         name: Review
 *         description: "Data review yang akan ditambahkan"
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - rating
 *             - comment
 *           properties:
 *             rating:
 *               type: integer
 *               description: "Rating untuk kamar (misalnya, 1 hingga 5)"
 *             comment:
 *               type: string
 *               description: "Komentar atau ulasan untuk kamar"
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari ulasan yang akan diubah"
 *         schema:
 *           type: string
 *       - in: body
 *         name: Review
 *         description: "Data ulasan yang akan diubah"
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             rating:
 *               type: integer
 *               description: "Rating untuk kamar (misalnya, 1 hingga 5)"
 *             comment:
 *               type: string
 *               description: "Komentar atau ulasan untuk kamar"
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
 *     description: "Menghapus ulasan yang sudah ada."
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - user
 *         - room
 *         - rating
 *         - comment
 *       properties:
 *         user:
 *           type: string
 *           description: "ID pengguna yang memberikan ulasan"
 *         room:
 *           type: string
 *           description: "ID kamar yang direview"
 *         rating:
 *           type: integer
 *           description: "Rating kamar (1-5)"
 *         comment:
 *           type: string
 *           description: "Komentar atau ulasan untuk kamar"
 *       example:
 *         user: "60b8d8ef5e5b5e5f7c5c5b5b"
 *         room: "60b8d8ef5e5b5e5f7c5c5b6b"
 *         rating: 4
 *         comment: "Kamar yang nyaman, sangat cocok untuk keluarga."
 */

