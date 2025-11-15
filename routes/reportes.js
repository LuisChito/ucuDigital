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



module.exports = router;