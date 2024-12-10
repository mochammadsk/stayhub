// Create transaction

/**
 * @swagger
 * /transaction/callback/{id}:
 *   post:
 *     summary: Membuat transaksi baru
 *     description: Endpoint ini digunakan oleh pengguna untuk membuat transaksi baru.
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID kamar yang ingin dipesan.
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Transaksi berhasil dibuat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction_token:
 *                       type: string
 *                       example: abcdef123456
 *                     redirect_url:
 *                       type: string
 *                       example: https://midtrans.com/redirect
 *       400:
 *         description: Validasi gagal atau permintaan tidak valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User ID is missing
 *       404:
 *         description: Data tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room not found
 *       500:
 *         description: Kesalahan server internal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: object
 */


/**
 * @swagger
 * /transaction/update/{id}:
 *   put:
 *     summary: Perbarui status transaksi
 *     description: Endpoint ini digunakan oleh admin untuk memperbarui status transaksi.
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID transaksi yang ingin diperbarui.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Status transaksi yang baru.
 *                 enum: [pending, completed, canceled]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Transaksi berhasil diperbarui.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 648f10d3d3b8c120f8eaa69d
 *                     status:
 *                       type: string
 *                       example: completed
 *       400:
 *         description: Validasi gagal atau permintaan tidak valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid transaction status
 *       404:
 *         description: Transaksi tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 *       500:
 *         description: Kesalahan server internal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: object
 */

