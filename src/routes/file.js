const express = require("express");
const router = express.Router();
const fileMiddleware = require('../middlewares/middlewares')
const controladorFile = require("../controladores/file");

//upload multiple files
router.post('/uploads',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpleado,
    controladorFile.uploads
);
//Listar files
router.get('/files',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpleado,
    controladorFile.getListFiles
);
//Obtener one file
router.get('/file/:name',
    //fileMiddleware.isLoggedIn,
    //fileMiddleware.isEmpleado,
    controladorFile.descargar
);
//Eliminar multiples files
router.delete('/files/:name',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpleado,
    controladorFile.deleteFile
);

module.exports = router;
