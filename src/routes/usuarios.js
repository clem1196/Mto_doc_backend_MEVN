// src/routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuarioMiddleware = require('../middlewares/middlewares');
const usuarioControlador = require('../controladores/usuarios')

//Registro de un nuevo usuario
router.post('/registro',
    //usuarioMiddleware.isLoggedIn,
    //usuarioMiddleware.isAdministrador, 
    usuarioMiddleware.validarRegistro,
    usuarioControlador.Registro
);
//Ingreso o inicio de sesión de usuario
router.post('/ingreso',
    usuarioControlador.Ingreso
);


//Gestion de usuarios: solo pueden gestionar los usuarios autenticados

//Listar usuarios
router.get('/usuarios',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isEmpleado,
    usuarioControlador.listarUsuarios
);
//obtener un usuario
router.get('/usuarios/:id',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isEmpleado,
    usuarioControlador.obtenerUnUsuario
);
//Editar un usuario
router.put('/usuarios/:id',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isAdministrador,
    usuarioControlador.editarUsuario
);
//Eliminar un usuario
router.delete('/usuarios/:id',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isAdministrador,
    usuarioControlador.eliminarUsuario
);

module.exports = router;