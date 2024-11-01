/**
 * @swagger
 * /signin:
 *   post:
 *     tags:
 *       - Auth
 *     security:
 *       -bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Admin"
 *     responses:
 *       200:
 *         description: Login Successful
 *       404:
 *         description: Login Failed
 */
