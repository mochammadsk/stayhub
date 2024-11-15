/**
 * @swagger
 * /auth/signin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@email.com"
 *                 required: true
 *               password:
 *                 type: string
 *                 example: "admin123"
 *                 required: true
 *     responses:
 *       200:
 *         description: Login Successful!
 *       404:
 *         description: Login Failed!
 */
