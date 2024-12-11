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
 *         id:
 *           type: string
 *           description: ID unik admin (otomatis dihasilkan oleh MongoDB).
 *         userName:
 *           type: string
 *           description: Nama pengguna admin.
 *           example: admin123
 *         email:
 *           type: string
 *           format: email
 *           description: Alamat email admin.
 *           example: admin@example.com
 *         role:
 *           type: string
 *           description: Peran pengguna, default adalah "admin".
 *           example: admin
 *         password:
 *           type: string
 *           format: password
 *           description: Kata sandi admin (akan di-hash saat disimpan).
 *           example: securepassword123
 *         verified:
 *           type: boolean
 *           description: Status verifikasi admin.
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan admin (otomatis dihasilkan oleh MongoDB).
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal terakhir pembaruan admin (otomatis dihasilkan oleh MongoDB).
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
 *         - address
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: ID unik pengguna (otomatis dihasilkan oleh MongoDB).
 *         fullName:
 *           type: string
 *           description: Nama lengkap pengguna.
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Alamat email pengguna.
 *           example: johndoe@example.com
 *         phone:
 *           type: integer
 *           description: Nomor telepon pengguna.
 *           example: 628123456789
 *         address:
 *           type: string
 *           description: Alamat pengguna.
 *           example: Jl. Raya No. 123, Jakarta
 *         role:
 *           type: string
 *           description: Peran pengguna, default adalah "user".
 *           example: user
 *         password:
 *           type: string
 *           format: password
 *           description: Kata sandi pengguna.
 *           example: mysecurepassword
 *         verified:
 *           type: boolean
 *           description: Status verifikasi pengguna.
 *           default: false
 *         profileImages:
 *           type: array
 *           description: Koleksi gambar profil pengguna.
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL gambar profil.
 *                 example: https://example.com/profile.jpg
 *               filename:
 *                 type: string
 *                 description: Nama file gambar profil.
 *                 example: profile.jpg
 *         ktpImages:
 *           type: array
 *           description: Koleksi gambar KTP pengguna.
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL gambar KTP.
 *                 example: https://example.com/ktp.jpg
 *               filename:
 *                 type: string
 *                 description: Nama file gambar KTP.
 *                 example: ktp.jpg
 *         room:
 *           type: array
 *           description: Koleksi ID kamar yang dimiliki oleh pengguna.
 *           items:
 *             type: string
 *             description: ID unik kamar.
 *             example: 648f10d3d3b8c120f8eaa69d
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan pengguna (otomatis dihasilkan oleh MongoDB).
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal terakhir pembaruan pengguna (otomatis dihasilkan oleh MongoDB).
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
 *         id:
 *           type: string
 *           description: ID unik kamar (otomatis dihasilkan oleh MongoDB).
 *           example: 648f10d3d3b8c120f8eaa69d
 *         name:
 *           type: string
 *           description: Nama kamar.
 *           example: Room 101
 *         status:
 *           type: string
 *           description: Status ketersediaan kamar.
 *           enum: [available, unavailable]
 *           example: available
 *         type:
 *           type: array
 *           description: Tipe kamar yang terkait.
 *           items:
 *             $ref: '#/components/schemas/RoomType'
 *         reviews:
 *           type: array
 *           description: Ulasan yang terkait dengan kamar.
 *           items:
 *             $ref: '#/components/schemas/Review'
 *         complaints:
 *           type: array
 *           description: Keluhan yang terkait dengan kamar.
 *           items:
 *             $ref: '#/components/schemas/Complaint'
 *         images:
 *           type: array
 *           description: Daftar gambar kamar.
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL gambar kamar.
 *                 example: https://example.com/image.jpg
 *               filename:
 *                 type: string
 *                 description: Nama file gambar.
 *                 example: image.jpg
 *         transaction:
 *           type: array
 *           description: Transaksi yang terkait dengan kamar.
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan kamar.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal terakhir pembaruan kamar.
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
 *         id:
 *           type: string
 *           description: ID unik transaksi (otomatis dihasilkan oleh MongoDB).
 *           example: 648f10d3d3b8c120f8eaa69d
 *         user:
 *           $ref: '#/components/schemas/User'
 *         room:
 *           $ref: '#/components/schemas/Room'
 *         cost:
 *           type: number
 *           description: Total biaya transaksi.
 *           example: 1500000
 *         status:
 *           type: string
 *           description: Status transaksi.
 *           enum: [pending, settlement, expired, cancel]
 *           example: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan transaksi.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal terakhir pembaruan transaksi.
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     FacilityRoom:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID unik fasilitas kamar (otomatis dihasilkan oleh MongoDB).
 *           example: 648f10d3d3b8c120f8eaa69d
 *         name:
 *           type: string
 *           description: Nama fasilitas kamar.
 *           example: AC
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan fasilitas (otomatis dihasilkan oleh MongoDB).
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal terakhir pembaruan fasilitas (otomatis dihasilkan oleh MongoDB).
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     RoomType:
 *       type: object
 *       required:
 *         - name
 *         - facility
 *         - description
 *         - cost
 *       properties:
 *         id:
 *           type: string
 *           description: ID unik tipe kamar (otomatis dihasilkan oleh MongoDB).
 *           example: 648f10d3d3b8c120f8eaa69d
 *         name:
 *           type: string
 *           description: Nama tipe kamar.
 *           example: Deluxe Room
 *         facility:
 *           type: array
 *           description: Daftar fasilitas yang tersedia untuk tipe kamar ini.
 *           items:
 *             $ref: '#/components/schemas/FacilityRoom'
 *         description:
 *           type: string
 *           description: Deskripsi tipe kamar.
 *           example: Kamar dengan pemandangan laut dan fasilitas lengkap.
 *         cost:
 *           type: number
 *           format: float
 *           description: Biaya per malam untuk tipe kamar ini.
 *           example: 1500000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan tipe kamar (otomatis dihasilkan oleh MongoDB).
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal terakhir pembaruan tipe kamar (otomatis dihasilkan oleh MongoDB).
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
 *         id:
 *           type: string
 *           description: ID unik ulasan (otomatis dihasilkan oleh MongoDB).
 *           example: 648f10d3d3b8c120f8eaa69d
 *         user:
 *           $ref: '#/components/schemas/User'
 *         room:
 *           $ref: '#/components/schemas/Room'
 *         rating:
 *           type: integer
 *           description: Penilaian kamar (1-5).
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         comment:
 *           type: string
 *           description: Komentar ulasan.
 *           example: "Kamar bersih dan nyaman."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan ulasan.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal terakhir pembaruan ulasan.
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
 *         id:
 *           type: string
 *           description: ID unik keluhan (otomatis dihasilkan oleh MongoDB).
 *           example: 648f10d3d3b8c120f8eaa69d
 *         user:
 *           $ref: '#/components/schemas/User'
 *         room:
 *           $ref: '#/components/schemas/Room'
 *         title:
 *           type: string
 *           description: Judul keluhan.
 *           example: "AC rusak"
 *         description:
 *           type: string
 *           description: Deskripsi keluhan.
 *           example: "AC di kamar tidak berfungsi sejak kemarin."
 *         status:
 *           type: string
 *           description: Status keluhan.
 *           enum: [pending, in progress, follow up, resolved, cancelled]
 *           example: pending
 *         images:
 *           type: array
 *           description: Gambar yang terkait dengan keluhan.
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL gambar keluhan.
 *                 example: https://example.com/image.jpg
 *               filename:
 *                 type: string
 *                 description: Nama file gambar.
 *                 example: image.jpg
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan keluhan.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal terakhir pembaruan keluhan.
 */
