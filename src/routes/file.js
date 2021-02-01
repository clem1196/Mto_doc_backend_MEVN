const express = require("express");
const router = express.Router();
const docMiddleware = require('../middlewares/middlewares')
const controladorDoc = require("../controladores/file");
//Crear roles
router.post('/upload',
    docMiddleware.isLoggedIn,    
    //docMiddleware.validarRoles,
    controladorDoc.upload
);
//Listar roles
router.get('/files',
    docMiddleware.isLoggedIn,
    docMiddleware.isEmpleado,
    controladorDoc.getListFiles
);
//Obtener un rol
router.get('/files/:name',
    docMiddleware.isLoggedIn,
    docMiddleware.isEmpleado,
    controladorDoc.download
);

module.exports = router;


/*let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);

  app.use(router);
};

module.exports = routes;*/