//src/routes/roles
const express = require('express');
const router = express.Router();
const controladorRoles = require('../controladores/roles');
const usuarioMiddleware = require('../middlewares/middlewares');

//Crear roles
router.post('/roles/crear',
    usuarioMiddleware.isLoggedIn, 
    usuarioMiddleware.isAdministrador, 
    usuarioMiddleware.validarRoles,
    controladorRoles.crearRol
);
//Listar roles
router.get('/roles/',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isEmpleado,
    controladorRoles.listarRol
);
//Obtener un rol
router.get('/roles/:id',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isEmpleado,
    controladorRoles.obtenerUnRol
);
//Editar un rol
router.put('/roles/:id',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isAdministrador,
    usuarioMiddleware.validarRoles,
    controladorRoles.editarRol
);
//Elimnar un rol
router.delete('/roles/:id',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isAdministrador,
    controladorRoles.eliminarRol
);

module.exports = router;
