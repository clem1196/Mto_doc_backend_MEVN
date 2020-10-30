//src/controladores/roles.js
const pool = require('../base_datos');

module.exports = {
    //Aqui se crea un rol
    crearRol: async (req, res) => {
        const { nombre_rol } = req.body;
        try {
            const consultarRoles = await pool.query('SELECT *FROM roles WHERE roles.nombre_rol=?', [nombre_rol]);
            if (consultarRoles.length > 0) {
                return res.status(409).send({ Message: 'el rol ya existe' });
            }
            const fecha = Date.now();
            const newRol = { nombre_rol, registrado: new Date(fecha) };
            pool.query('INSERT INTO roles set ?', [newRol]);
            return res.status(201).send({ Message: 'Se creó un rol correctamente' });
        } catch (error) {
            console.error(error);
        }
    },
    //Aqui se lista roles
    listarRol: async (req, res) => {
        try {
            const consultarRoles = await pool.query('SELECT *FROM roles');
            if (consultarRoles.length > 0)
                return res.status(200).send({ result: consultarRoles });
            res.status(404).send({ Message: 'no hay roles que mostrar' });
        } catch (error) {
            console.error(error);
        }
    },
    //Aqui se obtiene un rol
    obtenerUnRol: async (req, res) => {
        const { id } = req.params;
        try {
            const consultarRoles = await pool.query('SELECT *FROM roles WHERE roles.idroles=?', [id]);
            if (consultarRoles.length > 0)
                return res.status(200).send({ roles: consultarRoles });
            res.status(404).send({ message: 'El rol no existe o ya fue eliminado' });
        } catch (error) {
            console.error(error);
        }
    },
    //Aqui se edita un rol
    editarRol: async (req, res) => {
        const { id } = req.params;
        const { nombre_rol } = req.body;
        const fecha = Date.now();
        const newRol = {
            nombre_rol, actualizado: new Date(fecha)
        };
        try {
            const consultarRoles = await pool.query('SELECT * FROM roles WHERE roles.idroles=?', [id]);
            const consultarNombreRol = await pool.query('SELECT * FROM roles WHERE roles.nombre_rol=?', [nombre_rol]);
            if (consultarRoles.length > 0) {
                if (consultarNombreRol.length > 0) {
                    return res.status(409).send({ Message: 'El rol ya xiste' });
                } else {
                    await pool.query('UPDATE roles set? WHERE roles.idroles=?', [newRol, id]);
                    res.status(201).send({ Message: 'Rol actualizado correctamente' });
                }

            }
            res.status(404).send({ Message: 'El rol no existe o fue eliminado' });
        } catch (error) {
            console.error(error);
        }
    },
    //Aqui se elimina un rol
    eliminarRol: async (req, res) => {
        const { id } = req.params;
        try {
            // verificamos que el rol a eliminar exista
            const consultarRoles = await pool.query('SELECT *FROM roles WHERE roles.idroles=?', [id]);
            if (consultarRoles.length > 0) {
                //Verificamos si el rol está relacionado con uno o mas usuarios
                const consultarRelacion = await pool.query('SELECT *FROM usuarios_roles WHERE usuarios_roles.idroles=?', [id]);
                if (consultarRelacion.length > 0) {
                    //Eliminamos la relacion usuarios_roles
                    await pool.query('DELETE FROM usuarios_roles WHERE usuarios_roles.idroles=?', [id]);
                    //Eliminamos el rol 
                    await pool.query('DELETE FROM roles WHERE roles.idroles=?', [id]);
                    return res.status(200).send({ Message: 'Rol eliminado correctamente' });
                }
                //Eliminamos cualquier rol que no esté relacionado con un usuario
                pool.query('DELETE FROM roles WHERE roles.idroles=?', [id]);
                return res.status(200).send({ Message: 'Rol eliminado correctamente' });
            }
            res.status(404).send({ Message: 'El rol no existe o ya fue eliminado' });
        } catch (error) {
            console.error(error);
        }
    }
};