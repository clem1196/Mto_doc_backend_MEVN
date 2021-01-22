// src/routes/usuarios.js
const express = require('express');
const router = express.Router();
const documentosMiddleware = require('../middlewares/middlewares');
const documentosControlador = require('../controladores/documentos')

//Registro de un nuevo documento
router.post('/documentos',
    documentosMiddleware.isLoggedIn,
    documentosMiddleware.isEmpleado,
    documentosMiddleware.validarDoc,
    documentosControlador.crearDoc
);

//Gestion de documentos: solo pueden gestionar los usuarios autenticados y autorizados

//Listar documentos
router.get('/documentos',
    documentosMiddleware.isLoggedIn,
    documentosMiddleware.isEmpleado,
    documentosControlador.listarDoc
);
//obtener un documento
router.get('/documentos/:id',
    documentosMiddleware.isLoggedIn,
    documentosMiddleware.isEmpleado,
    documentosControlador.obtenerUnDoc
);

//Editar un documento
router.put('/documentos/:id',
    documentosMiddleware.isLoggedIn,
    documentosMiddleware.isEmpleado,
    documentosControlador.editarDoc
);
//Eliminar un documento
router.delete('/documentos/:id',
    documentosMiddleware.isLoggedIn,
    documentosMiddleware.isEmpleado,
    documentosControlador.eliminarDoc
);

module.exports = router;