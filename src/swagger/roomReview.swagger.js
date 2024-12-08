// Create Review
/**
 * @swagger
 * /room/{id}/review:
 *   post:
 *     tags:
 *       - Review  # Menentukan kategori "Review"
 *     summary: "Create a review for a room"
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

// Get reviews for a room
/**
 * @swagger
 * /room/{id}/review:
 *   get:
 *     tags:
 *       - Review
 *     summary: "Get reviews for a room"
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

