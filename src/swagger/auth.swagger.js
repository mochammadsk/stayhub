/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Mochammad Syahrul Kurniawan
 *                 required: true
 *               email:
 *                 type: string
 *                 example: mochrul.kurniawan@gmail.com
 *                 required: true
 *               phone:
 *                 type: string
 *                 example: 08123456789
 *                 required: true
 *               password:
 *                 type: string
 *                 example: "User_123"
 *                 required: true
 *     responses:
 *       200:
 *         description: Successful registration! Please verify your email
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal Server Error
 */

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
 *                 example: admin@email.com
 *                 required: true
 *               password:
 *                 type: string
 *                 example: admin123
 *                 required: true
 *     responses:
 *       200:
 *         description: Login Successfully
 *       404:
 *         description: Login Failed
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Verify user
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verify Successfully
 *       404:
 *         description: Verify Failed
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /auth/request-reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: mochrul.kurniawan@gmail.com
 *                 required: true
 *     responses:
 *       200:
 *         description: Reset password request sent successfully
 *       400:
 *         description: Invalid email address
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "User_123"
 *                 required: true
 *     responses:
 *       200:
 *         description: Reset password successfully
 *       400:
 *         description: Invalid token or password
 *       500:
 *         description: Internal Server Error
 */
