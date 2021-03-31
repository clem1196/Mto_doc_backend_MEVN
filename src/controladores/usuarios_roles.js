//src/controladores/usuarios_roles
const pool = require('../base_datos');

module.exports = {
    //Aqui se crea una relacion usuarios_roles
    crearUsuarios_roles: async (req, res) => {

        const { idusuario, idroles } = req.body;
        try {
            //Verificamos que el idusuario exista en la tabla usuarios
            const usuario = await pool.query('SELECT *FROM usuarios WHERE usuarios.idusuario=?', [idusuario]);
            if (!usuario.length > 0)
                return res.status(404).send({ Message: `el ID ${idusuario} en usuarios no existe` });
            //Verificamos que el idroles exista en la tabla roles
            const rol = await pool.query('SELECT *FROM roles WHERE roles.idroles=?', [idroles]);
            if (!rol.length > 0)
                return res.status(404).send({ Message: `el ID ${idroles} en roles no existe` });
            //verificamos que la relacion usuarios_roles no se repitan
            const usuarioRolExiste = await pool.query('SELECT idusuario, idroles FROM usuarios_roles WHERE idusuario=? and idroles=?', [idusuario, idroles])
            if (usuarioRolExiste.length)
                return res.status(400).send({ Message: 'Ya existe, no se admite duplicados' })
            const fecha = Date.now();
            const newUsuario_rol = {
                idusuario,
                idroles,
                registrado: new Date(fecha)
            };
            //Insertamos los datos del nuevo usuario en la bd
            await pool.query('INSERT INTO usuarios_roles set ?', [newUsuario_rol]);
            res.status(201).send({ Message: 'Se asignó correctamente un rol a un usuario'});
        } catch (error) {
            console.error(error);
        }
    },
    //Aqui se lista usuarios que fueron asignados algun rol (usuarios_roles)
    listarUsuarios_roles: async (req, res) => {
        try {
            //Listamos usuarios
            const usuarioRoles = await pool.query(
            `select idusuarios_roles, nombre_usuario, nombre_rol, usuarios_roles.registrado, usuarios_roles.actualizado
            from usuarios, roles, usuarios_roles
            where usuarios.idusuario=usuarios_roles.idusuario 
            and usuarios_roles.idroles=roles.idroles;`);
            if (usuarioRoles.length > 0)
                return res.status(200).send({ usuario_rol: usuarioRoles });
            res.status(404).send({ Message: 'No hay usuarios con roles que mostrar' });
        } catch (error) {
            console.error(error);
        }
    },
    //Aqui se obtiene un usuario asignado a un rol (usuarios_roles)
    obtenerUnUsuarios_roles: async (req, res) => {
        const { id } = req.params;
        try {
            //Verificamos si la relacion usuarios_roles exista.
            const usuarioRol = await pool.query('SELECT *FROM usuarios_roles WHERE usuarios_roles.idusuarios_roles=?', [id]);
            if (usuarioRol.length > 0)
                return res.status(200).send({ result: usuarioRol });
            res.status(404).send({ Mssage: 'El rol_usuario no existe, o fue eliminado' });
        } catch (error) {
            console.error(error);
        }
    },
    //Aqui se edita un usuarios_roles
    editarUnUsuarios_roles: async (req, res) => {
        const { id } = req.params;
        const { idusuario, idroles } = req.body;
        try {
            //Verificamos que el usuario exista
            const usuario = await pool.query('SELECT *FROM usuarios WHERE usuarios.idusuario=?', [idusuario]);
            if (!usuario.length > 0)
                return res.status(404).send({ Message: `el ID ${idusuario} en usuarios no existe` });
            //Verificamos que el rol exista
            const rol = await pool.query('SELECT *FROM roles WHERE roles.idroles=?', [idroles]);
            if (!rol.length > 0)
                return res.status(404).send({ Message: `el ID ${idroles} en roles no existe` });
            //verificamos que la relacion usuarios_roles no se repitan
            const usuarioRolExiste = await pool.query('SELECT idusuario, idroles FROM usuarios_roles WHERE idusuario=? and idroles=?', [idusuario, idroles])
            if (usuarioRolExiste.length >= 1)
                return res.status(400).send({ Message: 'Ya existe; no se admite duplicaión' })
            const fecha = Date.now();
            const newUsuario_rol = {
                idusuario,
                idroles,
                actualizado: new Date(fecha)
            };
            //Insertamos los nuevos datos a la bd
            await pool.query('UPDATE usuarios_roles set ? WHERE usuarios_roles.idusuarios_roles=?', [newUsuario_rol, id]);
            res.status(201).send({ Message: 'Se actualizó correctamente usuario_rol' });
        } catch (error) {
            console.error(error);
        }
    },
    //Aqui se elimina una rerlacion usuarios_roles
    eliminarUnUsuarios_roles: async (req, res) => {
        const { id } = req.params;
        try {
            //Verificamos que usuarios_roles exista
            const usuarioRol = await pool.query('SELECT *FROM usuarios_roles WHERE usuarios_roles.idusuarios_roles=?', [id]);
            if (usuarioRol.length > 0) {
                //Eliminamos usuarios_roles
                pool.query('DELETE FROM usuarios_roles WHERE usuarios_roles.idusuarios_roles=?', [id]);
                res.status(200).send({ Message: 'El usuario_rol fue eliminado correctamente' });
            } else {
                res.status(404).send({ message: `El ID ${id} no existe o ya fue eliminado` });
            }
        } catch (error) {
            console.error(error);
        }
    }
};