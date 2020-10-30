//src/controladores/usuarios.js
const bcrypt = require('bcryptjs');
const pool = require('../base_datos.js');
const jwt = require('jsonwebtoken');

module.exports = {
    //Registro de usuario
    Registro: async (req, res) => {
        const { nombre_usuario, contraseña } = req.body;
        try {
            const consultarUsuario = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
            if (consultarUsuario.length)
                return res.status(409).send({ Message: 'El nombre de usuario ya existe!' });

            // Si el nombre de usuario es valido lo encriptamos su contraseña
            const hash = await bcrypt.hash(contraseña, 10);
            const fecha = Date.now();
            const newUsuario = { nombre_usuario, contraseña: hash, registrado: new Date(fecha) };
            // Agregamos los datos el usuario y contraseña encriptado a la bd
            const insertarUsuario = await pool.query('INSERT INTO usuarios SET ?', [newUsuario]);
            return res.status(201).send({ Message: 'se creó correctamente!', user: insertarUsuario });

        } catch (error) {
            console.error(error)
        }
    },
    //Iniciar sesión
    Ingreso: async (req, res) => {
        const { nombre_usuario, contraseña } = req.body;
        try {
            const consultarUsuario = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
            if (!consultarUsuario.length)
                return res.status(401).send({ Message: 'El nombre de usuario no existe!' });
            // verificamos la contraseña
            const compararContraseña = await bcrypt.compare(contraseña, consultarUsuario[0]['contraseña']);
            if (compararContraseña) {
                /*Creamos una cadena consulta y lo guardamos en una constante llamada "consulta" luego  este lo pasamos
                 en la query*/
                const consulta = `SELECT nombre_rol FROM usuarios 
                inner join usuarios_roles on usuarios.idusuario=usuarios_roles.idusuario                                                               
                inner join roles on usuarios_roles.idroles=roles.idroles 
                WHERE nombre_usuario=?`;
                //const nombre

                const verificarRol = await pool.query(consulta, [consultarUsuario[0].nombre_usuario]);
                if (verificarRol.length > 0) {
                    //Creamos el token incluyendo el nombre del rol que obtuvimos en verificarRol
                    const token = jwt.sign(
                        {
                            username: consultarUsuario[0].nombre_usuario,
                            userId: consultarUsuario[0].idusuario,
                            rol: verificarRol
                        },
                        'clem1196',
                        {
                            expiresIn: '1d'
                        }
                    );
                    const fecha = Date.now();
                    const acceso = { ultimo_acceso: new Date(fecha) }
                    //actualizamos el ultimo_acceso del usuario
                    await pool.query('UPDATE usuarios SET ? WHERE idusuario = ?', [acceso, consultarUsuario[0].idusuario]);
                    return res.status(200).send({ Message: 'Logged in!', token, user: consultarUsuario[0] });
                }
                //Si no encontramos el rol lo devolvemos
                return res.status(400).send({ Message: 'El usuario que intenta iniciar sesión aún no tiene rol, asígnale uno' });
            }
            res.status(400).send({ Message: 'El usuario o la contraseña no son correctos' });
        } catch (error) {
            console.error(error);
        }
    },
    //Listar Usuarios
    listarUsuarios: async (req, res) => {
        try {
            const consultarUsuario = await pool.query('SELECT *FROM usuarios');
            if (consultarUsuario.length > 0)
                return res.status(200).send({ usuarios: consultarUsuario });
            res.status(404).send({ message: 'No hay usuarios para mostrar' });
        } catch (error) {
            console.error(error);
        }
    },
    //Obtener un usuario
    obtenerUnUsuario: async (req, res) => {
        const { id } = req.params;
        try {
            const consultarUsuario = await pool.query('SELECT * FROM usuarios where idusuario=?', [id]);
            if (consultarUsuario.length > 0)
                return res.status(200).send({ usuario: consultarUsuario });
            res.status(404).send({ Message: 'El usuario no existe' });
        } catch (error) {
            console.error(error);
        }
    },
    //Editar un usuario
    editarUsuario: async (req, res) => {
        const { id } = req.params;
        const { nombre_usuario, contraseña } = req.body;
        try {
            //Verificamos que el usuario a editar exista, es decir que el id sea válido
            consultarUsuario = await pool.query('SELECT *FROM usuarios WHERE usuarios.idusuario=?', [id]);
            if (consultarUsuario.length > 0) {
                //Verificamos que el nuevo nombre_usuario ya exista
                const consultarNombre = await pool.query('SELECT *FROM usuarios WHERE usuarios.nombre_usuario=?', [nombre_usuario]);
                if (consultarNombre.length > 0) {
                    return res.status(409).send({ Message: 'El usuario ya existe!' });
                } else {
                    const hash = await bcrypt.hash(contraseña, 10);
                    const fecha = Date.now();
                    const nuevoUsuario = { nombre_usuario, contraseña: hash, ultimo_acceso: new Date(fecha) };
                    // Actualizamos los datos y la contreseña encriptada
                    await pool.query('UPDATE usuarios set ? WHERE idusuario=?', [nuevoUsuario, id]);
                    return res.status(201).send({ Message: 'Actualizado correctamente!' });
                }
            }
            res.status(404).send({ Message: 'El ID del usuario no existe; o fue eliminado' });
        } catch (error) {
            console.error(error);
        }
    },
    //Eliminar un usuario
    eliminarUsuario: async (req, res) => {
        const { id } = req.params;
        //verificamos si el usuario a eliminar existe
        const consultarUsuario = await pool.query('SELECT *FROM usuarios WHERE usuarios.idusuario=?', [id]);
        if (consultarUsuario.length > 0) {
            //verificamos si está relacionado o asignado a algún rol
            const verificarRelacion = await pool.query('SELECT *FROM usuarios_roles WHERE usuarios_roles.idusuario=?', [id]);
            if (verificarRelacion.length > 0) {
                //Eliminamos la relacion usuarios_roles 
                await pool.query('DELETE FROM usuarios_roles WHERE usuarios_roles.idusuario=?', [id]);
                //Eliminamos el usuario 
                await pool.query('DELETE FROM usuarios WHERE usuarios.idusuario=?', [id]);
                return res.status(200).send({ Message: 'Se eliminó correctamente' });

            } else {
                //Eliminamos cualquier usuario que no esté relacionado con un rol
                await pool.query('DELETE FROM usuarios WHERE usuarios.idusuario=?', [id]);
                return res.status(200).send({ Message: 'Se eliminó correctamente' });
            }
        }
        res.status(404).send({ Message: 'El usuario no existe o ya se eliminó' });
    }
};