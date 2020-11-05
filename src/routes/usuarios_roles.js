//src/routes/usuarios_roles.js
const express = require('express');
const router = express.Router();
const controladorU_roles = require('../controladores/usuarios_roles');
const usuarioMiddleware = require('../middlewares/middlewares');

//Crear o asignar Rol a un usuario
router.post('/u_roles/crear',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isAdministrador,  
    usuarioMiddleware.validarUsuario_rol,
    controladorU_roles.crearUsuarios_roles
);
//Listar usuarios_roles
router.get('/u_roles/',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isEmpleado,
    controladorU_roles.listarUsuarios_roles
);
//Obtenr un usuario_rol
router.get('/u_roles/:id',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isEmpleado,
    controladorU_roles.obtenerUnUsuarios_roles
);
//Editar un usuario_rol
router.put('/u_roles/:id',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isAdministrador,
    usuarioMiddleware.validarUsuario_rol,
    controladorU_roles.editarUnUsuarios_roles
);
//Eliminar un usuario_rol
router.delete('/u_roles/:id',
    usuarioMiddleware.isLoggedIn,
    usuarioMiddleware.isAdministrador,
    controladorU_roles.eliminarUnUsuarios_roles
);

module.exports = router;
