//src/middlewares/middlewares.js
const jwt = require('jsonwebtoken');

module.exports = {
    validarDoc: (req, res, next) => {
        
        // número_doc min 6 chars
        if (!req.body.doc || req.body.doc.length < 3) {
            return res.status(400).send({ Message: 'Por favor ingrese el número de documento, minimo 6 caracteres' });
        }
        // estado
        if (!req.body.estado) {
            return res.status(400).send({ Message: 'Por favor ingrese el Estado' });
        }
        next();
    },
    validarRegistro: (req, res, next) => {
        // nombre_usuario min length 3
        if (!req.body.nombre_usuario || req.body.nombre_usuario.length < 3) {
            return res.status(400).send({ Message: 'Por favor ingresa nombre de usuario, minimo 3 caracteres.' });
        }
        // contraseña min 6 chars
        if (!req.body.contraseña || req.body.contraseña.length < 6) {
            return res.status(400).send({ Message: 'Por favor ingrese una contraseña, minimo 6 caracteres' });
        }
        // repetir contraseña
        if (!req.body.repite_contraseña || req.body.contraseña != req.body.repite_contraseña) {
            return res.status(400).send({ Message: 'Las contraseñas no coinciden' });
        }
        next();
    },
    validarRoles: (req, res, next) => {
        // nombre_rol min length 3
        if (!req.body.nombre_rol || req.body.nombre_rol.length < 3) {
            return res.status(400).send({ Message: 'Por favor ingresa nombre de rol, minimo 3 caracteres.' });
        }
        next();
    },
    validarUsuario_rol: (req, res, next) => {
        // Ingrese el id de usuario
        if (!req.body.idusuario || !req.body.idusuario > 0) {
            return res.status(400).send({ Message: 'Por favor ingresa el id de usuario.' });
        }
        // Ingrese el id de roles
        if (!req.body.idroles || !req.body.idroles > 0) {
            return res.status(400).send({ Message: 'Por favor ingresa el id de roles.' });
        }
        next();
    },
    isAdministrador: (req, res, next) => {
        /*Traemos el req.token y obtenemos y guardamos el rol, y luego verificamos si es admin*/
        const rol = req.token.rol;
        const rolAdmin = rol.filter((element) => (element.nombre_rol === 'admin'))
        if (rolAdmin.length)
            return next();
        res.status(401).send({ Message: 'Usted no tiene permiso!' });
    },
    isEmpleado: (req, res, next) => {
        /*obtenemos el rol del req.token y guardamos para luego verificar si es empleado o admin*/
        const rol = req.token.rol;
        const rolEmpleado = rol.filter((element) => (element.nombre_rol === 'empleado'));
        const rolAdmin = rol.filter((element) => (element.nombre_rol === 'admin'));       
        if (rolEmpleado.length)
            return next();
        if (rolAdmin.length)
            return next();
        res.status(401).send({ Message: 'Usted no tiene permiso!' });        
    },
    isLoggedIn: (req, res, next) => {

        // SIN LA PALABRA Bearer ANTES DEL token
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({ ok: false, Message: 'Token invalido' });
        }
        else {
            token = token.replace('Bearer', '');
            jwt.verify(token, 'clem1196', (err, token) => {
                if (err) {
                    return res.status(401).send({ ok: false, Message: 'No se pudo verificar el token' });
                } else {
                    req.token = token
                    next();
                }
            });
        }
        // CON LA PALABRA Bearer ANTES DEL token
        /*const bearerHeader = req.headers['authorization'];
        if (bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            let bearerToken = bearer[1];

            jwt.verify(bearerToken, 'clem1196', (err, bearerToken) => {
                if (err) {
                    return res.sendStatus(403);
                } else {
                    
                    req.token = bearerToken;                    
                    next();
                }
            });
        } else {
            res.sendStatus(403);
        }*/

    }
};