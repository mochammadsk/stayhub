/**
 * @swagger
 * /user/profile:
 *  get:
 *   tags:
 *    - User
 *   summary: Get user profile
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Successfully retrieved user profile
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/User'
 *    404:
 *     description: User not found
 *    500:
 *     description: Internal server error
 */

/**
 * @swagger
 * /user/profile/update:
 *  put:
 *   tags:
 *    - User
 *   summary: Update profile data
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *     required: true
 *     content:
 *       multipart/form-data:
 *         schema:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             address:
 *               type: string
 *             profileImages:
 *               type: array
 *               items:
 *                 type: string
 *                 format: binary
 *             ktpImages:
 *               type: array
 *               items:
 *                 type: string
 *                 format: binary
 *   responses:
 *    200:
 *     description: Profile updated successfully
 *    404:
 *     description: User not found
 *    500:
 *     description: Internal server error
 */

/**
 * @swagger
 * /user/profile/update:
 *  delete:
 *   tags:
 *    - User
 *   summary: Delete photo profile
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Photo profile deleted successfully
 *    404:
 *     description: User not found
 *    500:
 *     description: Internal server error
 */
