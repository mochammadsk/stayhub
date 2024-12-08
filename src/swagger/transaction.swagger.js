// Create transaction for room booking
/**
 * @swagger
 * /transaction/{id}:
 *   post:
 *     tags:
 *       - Transaction  # Menentukan kategori "Transaction"
 *     summary: "Create a new transaction for room booking"
 *     description: "Membuat transaksi baru untuk pemesanan kamar, memverifikasi ketersediaan kamar dan memeriksa transaksi yang sudah ada."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari kamar yang akan dipesan"
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: "Transaksi berhasil dibuat"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: string
 *                       example: "60d72e4c8c02135f74b6d3d8"
 *                     cost:
 *                       type: number
 *                       example: 500000
 *       400:
 *         description: "Terjadi kesalahan seperti kamar penuh, transaksi sebelumnya, atau pengguna tidak terautentikasi."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Room is full"
 *       404:
 *         description: "Kamar tidak ditemukan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Room not found"
 *       500:
 *         description: "Terjadi kesalahan server saat membuat transaksi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

// Get all transactions
/**
 * @swagger
 * /transaction:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: "Get all transactions"
 *     description: "Mendapatkan semua transaksi yang dilakukan oleh pengguna."
 *     responses:
 *       200:
 *         description: "Daftar transaksi berhasil diambil."
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
 *                     $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Get transaction by ID
/**
 * @swagger
 * /transaction/{id}:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: "Get transaction by ID"
 *     description: "Mendapatkan informasi transaksi berdasarkan ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari transaksi"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Informasi transaksi berhasil diambil."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: "Transaksi tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Update transaction
/**
 * @swagger
 * /transaction/{id}:
 *   put:
 *     tags:
 *       - Transaction
 *     summary: "Update transaction"
 *     description: "Memperbarui informasi transaksi berdasarkan ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID transaksi yang akan diperbarui."
 *         schema:
 *           type: string
 *       - in: body
 *         name: Transaction
 *         description: "Data transaksi yang akan diperbarui."
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               description: "Status transaksi baru"
 *               example: "completed"
 *     responses:
 *       200:
 *         description: "Transaksi berhasil diperbarui."
 *       404:
 *         description: "Transaksi tidak ditemukan."
 *       500:
 *         description: "Kesalahan internal server."
 */

// Delete transaction
/**
 * @swagger
 * /transaction/{id}:
 *   delete:
 *     tags:
 *       - Transaction
 *     summary: "Delete a transaction"
 *     description: "Menghapus transaksi berdasarkan ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID transaksi yang akan dihapus."
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Transaksi berhasil dihapus."
 *       404:
 *         description: "Transaksi tidak ditemukan."
 *       500:
 *         description: "Kesalahan internal server."
 */