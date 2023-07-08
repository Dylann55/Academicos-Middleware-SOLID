const jwt = require('jsonwebtoken');
require("dotenv").config(); // Cargar variables de entorno desde un archivo .env

class DecodeToken {
  constructor() {
    this.secretToken = process.env.secretToken;
  }

  async DecodeToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretToken, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

class GenerateToken {
  constructor() {
    this.secretToken = process.env.secretToken;
  }

  async Generate(payload) {
    const token = jwt.sign(payload, this.secretToken);
    return token;
  }
}

module.exports = { DecodeToken, GenerateToken };
