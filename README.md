# **StayHub**

---

## **Features**

- **User Authentication**: Use JWT.
- **Role-based Authorization**: `admin` and `user`.
- **CRUD Operations**:
- **Payment Gateway Integration**: Terhubung dengan Midtrans.
- **Email Service**: Register account and forgot password.

---

## **Tech Stack**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Cloud Services**:
  - Midtrans (Payment Gateway)
- **Other**: Swagger (API Documentation), Vercel (Deploy)

---

## **Getting Started**

### **Prerequisites**

1. Install [Node.js](https://nodejs.org/) (v20.x).
2. Install [MongoDB](https://www.mongodb.com/).

### **Installation**

1. Clone repository ini:
   ```bash
   https://github.com/mochammadsk/stayhub
   cd stayhub
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables dengan membuat file `.env` di root project (lihat [Environment Variables](#environment-variables)).

### **Running the App**

- **Development**:
  ```bash
  npm run dev
  or
  nodemon
  ```
- **Production**:
  ```bash
  npm run start
  ```

### **Testing**

Untuk menjalankan tes:

```bash
npm run test
```

---

## **Environment Variables**

Create `.env` file in root directory and adjust to

```env
.env.example
```

---

## **API Documentation**

Dokumentasi API dibuat menggunakan **Swagger**.

### **Akses Dokumentasi API**

Setelah server dijalankan, buka [http://localhost:8000/api-docs](http://localhost:3000/api-docs).

---
