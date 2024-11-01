/**
 * @swagger
 * /list/user:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all data user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: Failed get data user!
 */

/**
 * @swagger
 * /list/user/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get user by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: Failed get user!
 */

/**
 * @swagger
 * /update/user/{id}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update user by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Failed update user!
 */

/**
 * @swagger
 * /delete/user/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete user by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Failed delete user!
 */
