require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const dbConfig = require('./config/db.config');

const app = express();
const PORT = 3000;

async function connectDB() {
  try {
    await sql.connect(dbConfig);
    console.log("🟢 Conectado a SQL Server con éxito.");
  } catch (err) {
    console.error("🔴 Error al conectar a SQL Server:", err);
  }
}

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
