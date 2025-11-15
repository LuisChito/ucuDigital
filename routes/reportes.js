const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../config/db.config');

router.post('/crearReporte', async (req, res) => {

    const reportePayload = req.body.reporte; 
    
    if (!reportePayload) {
        return res.status(400).json({ 
            error: 'El payload del reporte es obligatorio.' 
        });
    }

    const Nombre = reportePayload['Nombre'];
    const Apellido = reportePayload['Apellido'];
    const Tipo = reportePayload['Tipo'];
    const Descripcion = reportePayload['Descripcion'];
    const Latitud = reportePayload['Latitud'];
    const Longitud = reportePayload['Longitud'];    
    const Numero = reportePayload['Numero'];

    if (!Nombre || !Apellido || !Tipo || !Descripcion || !Latitud || !Longitud || !Numero) {
        return res.status(400).json({ error: 'Faltan campos obligatorios para crear el reporte.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const request = pool.request();

        request.input('Nombre', sql.NVarChar(100), Nombre);
        request.input('Apellido', sql.NVarChar(100), Apellido);
        request.input('Tipo', sql.NVarChar(50), Tipo);
        request.input('Descripcion', sql.NVarChar(sql.MAX), Descripcion);
        request.input('Latitud', sql.Decimal(9, 6), Latitud);
        request.input('Longitud', sql.Decimal(9, 6), Longitud);
        request.input('Numero', sql.NVarChar(15), Numero);

        const result = await request.execute('CrearReporte');
        
        const nuevoReporteID = result.recordset[0].ReporteID;
        
        res.status(201).json({ 
            mensaje: 'Reporte ciudadano creado y registrado exitosamente.',
            ReporteID: nuevoReporteID,
            Estatus: 'Pendiente'
        });

    } catch (err) {
        console.error("🔴 Error al crear reporte:", err);
        res.status(500).json({ 
            error: 'Error interno del servidor al procesar el reporte.', 
            details: err.message 
        });
    }
});


router.post('/reportesPendientes', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = pool.request();

        const result = await request.execute('ReportesPendientes'); 
        
        res.status(200).json({ 
            reportes: result.recordset 
        });
    } catch (err) {
        console.error("🔴 Error al obtener reportes:", err);
        res.status(500).json({
            error: 'Error interno del servidor al obtener los reportes.',
            details: err.message
        });
    }
});

router.get('/comercios', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = pool.request();

        const result = await request.execute('ObtenerComercios');

        res.status(200).json({ comercios: result.recordset });
    } catch (err) {
        console.error("🔴 Error al obtener comercios:", err);
        res.status(500).json({
            error: 'Error interno del servidor al obtener los comercios.',
            details: err.message
        });
    }
});

router.get('/obtenerEventos', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const request = pool.request();

        const result = await request.execute('ObtenerEventos');

        res.status(200).json({ eventos: result.recordset });
    } catch (err) {
        console.error("🔴 Error al obtener eventos:", err);
        res.status(500).json({
            error: 'Error interno del servidor al obtener los eventos.',
            details: err.message
        });
    }
});

router.post('/crearComercio', async (req, res) => {
    // 1. Obtener los datos del payload
    // Destructuración: Las claves del payload coinciden con las variables de JS
    const { Nombre, Categoria, Descripcion, Link, LinkFacebook } = req.body;

    try {
        // 3. Crear una solicitud (Request)
        const request = new sql.Request();

        // 4. Definir y enlazar los parámetros del SP
        // ¡Importante! Los nombres de los inputs deben coincidir con los parámetros del SP en SQL.
        // Los tipos de datos deben coincidir con la definición de tu SP.
        
        request.input('Nombre', sql.NVarChar(255), Nombre);
        request.input('Categoria', sql.NVarChar(100), Categoria);
        
        // Parámetros opcionales
        request.input('Descripcion', sql.NVarChar(sql.MAX), Descripcion);
        request.input('Link', sql.NVarChar(500), Link);
        request.input('LinkFacebook', sql.NVarChar(500), LinkFacebook);

        // 5. Ejecutar el Stored Procedure
        const resultado = await request.execute('CrearComercio');
        
        // 6. Obtener el ID insertado (si el SP devuelve SCOPE_IDENTITY())
        const nuevoId = resultado.recordset[0]?.ComercioID;

        // 7. Enviar respuesta de éxito
        res.status(201).json({ 
            mensaje: 'Comercio creado y registrado.', 
            comercioID: nuevoId
        });

    } catch (error) {
        console.error('🔴 Error al crear el comercio:', error.message);
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al ejecutar el SP.',
            detalles: error.message // Útil para depuración local
        });
    }
});

module.exports = router;