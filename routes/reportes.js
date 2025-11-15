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

// Nuevo endpoint para crear un evento
router.post('/crearEvento', async (req, res) => {
    // 1. Obtener los datos del payload
    const { titulo, cuerpo, fecha, lat, lng } = req.body;

    // 2. Validación básica de datos
    if (!titulo || !cuerpo || !fecha || !lat || !lng) {
        return res.status(400).json({ 
            mensaje: 'Faltan parámetros obligatorios (titulo, cuerpo, fecha, lat, lng) en el payload.' 
        });
    }

    try {
        // 3. Crear una solicitud (Request)
        const request = new sql.Request();

        // 4. Definir y enlazar los parámetros del SP
        // Los nombres aquí (Titulo, Cuerpo, etc.) DEBEN coincidir con los parámetros del SP en SQL.
        request.input('Titulo', sql.NVarChar(255), titulo);
        request.input('Cuerpo', sql.NVarChar(sql.MAX), cuerpo);
        request.input('Fecha', sql.DateTime, new Date(fecha)); // Crucial: convertir a objeto Date
        request.input('Lat', sql.Decimal(9, 6), lat);
        request.input('Lng', sql.Decimal(9, 6), lng);

        // 5. Ejecutar el Stored Procedure
        // Usamos 'SP_InsertarEvento' (el nombre del último SP que creamos)
        const resultado = await request.execute('InsertarEvento');
        
        // 6. Obtener el ID insertado
        const nuevoId = resultado.recordset[0]?.NuevoEventoID;

        // 7. Enviar respuesta de éxito
        res.status(201).json({ 
            mensaje: '🎉 Evento creado exitosamente.', 
            eventoID: nuevoId
        });

    } catch (error) {
        console.error('🔴 Error al crear el evento:', error.message);
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al ejecutar el SP.',
            detalles: error.message // Útil para depuración local
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

router.post('/crearEvento', async (req, res) => {
    const payload = req.body;

    if (!payload) {
        return res.status(400).json({ error: 'Payload obligatorio con los datos del evento.' });
    }

    const { Nombre, Categoria, Descripcion, Link, LinkFacebook } = payload;

    if (!Nombre || !Categoria || !Descripcion || !Link || !LinkFacebook) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: Nombre, Categoria, Descripcion, Link, LinkFacebook.' });
    }

    try {
        const poolConnection = await sql.connect(dbConfig);
        const requestSP = poolConnection.request();

        requestSP.input('Nombre', sql.NVarChar(255), Nombre);
        requestSP.input('Categoria', sql.NVarChar(sql.MAX), Categoria);
        requestSP.input('Descripcion', sql.NVarChar(sql.MAX), Descripcion);
        requestSP.input('Link', sql.NVarChar(255), Link);
        requestSP.input('LinkFacebook', sql.NVarChar(255), LinkFacebook);

        const execResult = await requestSP.execute('CrearComercio');

        const nuevoId = execResult.recordset?.[0]?.NuevoEventoID ?? execResult.recordset?.[0]?.EventoID ?? null;

        res.status(201).json({
            mensaje: 'Evento creado exitosamente mediante SP_CrearEvento.',
            eventoID: nuevoId,
            resultado: execResult.recordset ?? null
        });
    } catch (err) {
        console.error('🔴 Error al ejecutar SP_CrearEvento:', err);
        res.status(500).json({
            error: 'Error interno al crear el evento.',
            detalles: err.message
        });
    }
});

module.exports = router;