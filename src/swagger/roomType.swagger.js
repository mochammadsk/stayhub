// Get all type rooms
/**
 * @swagger
 * /type-room:
 *   get:
 *     tags:
 *       - TypeRoom  # Menentukan kategori "TypeRoom"
 *     summary: "Get all type rooms"
 *     description: "Mendapatkan daftar semua jenis kamar beserta fasilitas yang terkait."
 *     responses:
 *       200:
 *         description: "Daftar jenis kamar berhasil diambil."
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
 *                     $ref: '#/components/schemas/TypeRoom'
 *       404:
 *         description: "Tidak ada data ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Get one type room
/**
 * @swagger
 * /type-room/{id}:
 *   get:
 *     tags:
 *       - TypeRoom  # Menentukan kategori "TypeRoom"
 *     summary: "Get type room by ID"
 *     description: "Mendapatkan informasi jenis kamar berdasarkan ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari jenis kamar"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Informasi jenis kamar berhasil diambil."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeRoom'
 *       404:
 *         description: "Jenis kamar tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Create type room
/**
 * @swagger
 * /type-room:
 *   post:
 *     tags:
 *       - TypeRoom  # Menentukan kategori "TypeRoom"
 *     summary: "Create a new type room"
 *     description: "Membuat jenis kamar baru dengan nama, fasilitas, deskripsi, dan biaya."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - facility
 *               - description
 *               - cost
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Nama jenis kamar"
 *               facility:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Daftar fasilitas yang tersedia dalam jenis kamar"
 *               description:
 *                 type: string
 *                 description: "Deskripsi jenis kamar"
 *               cost:
 *                 type: number
 *                 description: "Biaya jenis kamar"
 *     responses:
 *       201:
 *         description: "Jenis kamar berhasil dibuat."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data created"
 *                 data:
 *                   $ref: '#/components/schemas/TypeRoom'
 *       400:
 *         description: "Data tidak valid."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Update type room
/**
 * @swagger
 * /type-room/{id}:
 *   put:
 *     tags:
 *       - TypeRoom  # Menentukan kategori "TypeRoom"
 *     summary: "Update an existing type room"
 *     description: "Memperbarui data jenis kamar berdasarkan ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari jenis kamar yang akan diperbarui"
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               facility:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               cost:
 *                 type: number
 *     responses:
 *       200:
 *         description: "Jenis kamar berhasil diperbarui."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data updated"
 *                 data:
 *                   $ref: '#/components/schemas/TypeRoom'
 *       404:
 *         description: "Jenis kamar tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */

// Delete type room
/**
 * @swagger
 * /type-room/{id}:
 *   delete:
 *     tags:
 *       - TypeRoom  # Menentukan kategori "TypeRoom"
 *     summary: "Delete a type room by ID"
 *     description: "Menghapus jenis kamar berdasarkan ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID dari jenis kamar yang akan dihapus"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Jenis kamar berhasil dihapus."
 *       404:
 *         description: "Jenis kamar tidak ditemukan."
 *       500:
 *         description: "Terjadi kesalahan internal server."
 */