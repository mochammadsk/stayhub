# **StayHub 🏠**

---

## **Features**

- **User Authentication**: Use JWT.
- **Role-based Authorization**: `admin` and `user`.
- **CRUD Operations**:
- **Payment Gateway Integration**: Connect with Midtrans.
- **Email Service**: Register account and forgot password.

---

## **Tech Stack**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Cloud Services**: Midtrans (Payment Gateway)
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
3. Set up environment variables by creating a `.env` file in root project.

### **Running the App**

- **Development**:

  ```bash
    nodemon
  ```

- **Production**:
  ```bash
  npm run start
  ```

### **Testing**

To run the test

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

API documentation is created using **Swagger**.

### **Akses Dokumentasi API**

Once the server is running, open it [http://localhost:8000/api-docs](http://localhost:8000/api-docs).

---

## Status Badge

[![STAYHUB CI/CD](https://github.com/mochammadsk/stayhub/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/mochammadsk/stayhub/actions/workflows/main.yml)
