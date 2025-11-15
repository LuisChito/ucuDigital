const express = require('express');
const sql = require('mssql');
const dbConfig = require('./config/db.config');
const cors = require('cors'); 
require('dotenv').config();

// Importación de Rutas (CORREGIDA: Apuntando al nombre exacto del archivo)
const reportes = require('./routes/reportes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); 
app.use(express.json()); 
app.use('/api', reportes);

// Conexión a Base de Datos
async function connectDB() {
    try {
        await sql.connect(dbConfig);
        console.log("🟢 Conectado a SQL Server con éxito.");
    } catch (err) {
        console.error("🔴 Error al conectar a SQL Server:", err.message);
        // Opcional: Salir de la aplicación si no se puede conectar a la BD
        // process.exit(1); 
    }
}

connectDB();

// Inicio del Servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});