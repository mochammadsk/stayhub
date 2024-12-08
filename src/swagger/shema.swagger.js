/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - userName
 *         - email
 *         - password
 *       properties:
 *         userName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - phone
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string   # Mengubah ke string untuk fleksibilitas format nomor telepon
 *         password:
 *           type: string
 *           format: password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - name
 *         - status
 *         - type
 *       properties:
 *         name:
 *           type: string
 *         status:
 *           type: string
 *           enum: ['available', 'unavailable']
 *         type:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TypeRoom'
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *         complaints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Complaint'
 *         transaction:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - user
 *         - room
 *         - cost
 *       properties:
 *         user:
 *           type: string
 *         room:
 *           type: string
 *         cost:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: ['pending', 'paid']
 *         orderId:
 *           type: string
 *         paymentUrl:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Facility:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         iconUrl:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TypeRoom:
 *       type: object
 *       required:
 *         - name
 *         - cost
 *       properties:
 *         name:
 *           type: string
 *         cost:
 *           type: number
 *           format: float
 *         description:
 *           type: string
 *         facility:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Facility'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - rating
 *         - comment
 *         - user
 *         - room
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         user:
 *           type: string
 *         room:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Complaint:
 *       type: object
 *       required:
 *         - user
 *         - room
 *         - title
 *         - description
 *       properties:
 *         user:
 *           type: string
 *         room:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: ['pending', 'in progress', 'resolved', 'cancelled']
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               filename:
 *                 type: string
 */
