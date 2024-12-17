module.exports = {
    testEnvironment: "node",
    testMatch: ["**/__test__/**/*.test.js", "**/?(*.)+(spec|test).js"],
    collectCoverage: true,
    collectCoverageFrom: [
      "src/controllers/**/*.js",
      "src/models/**/*.js",
      "src/routes/**/*.js"
    ],
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "/src/__test__/",
      "/src/config/",
      "/src/middleware/",
      "src/models/transaction.model.js", // File spesifik yang ingin dikecualikan
      "src/routes/auth.routes.js",       // Contoh file yang tidak ingin diuji
      "src/routes/transaction.routes.js",
      "src/controllers/auth.controller.js",
      "src/controllers/transaction.controller.js",
      "src/controllers/userAuth.controller.js",
      "src/models/userPassReset.model.js",
      "src/models/userVerification.model.js",
      "src/routes/midtrans.routes.js",
    ],     
    verbose: true,
    forceExit: true
  };
  