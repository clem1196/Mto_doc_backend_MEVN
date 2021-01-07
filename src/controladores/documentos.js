const pool = require('../base_datos.js');

module.exports = {
    //Registro de documentos
    crearDoc: async (req, res) => {
        const { idusuario, tipo_doc, doc, estado } = req.body;
        try {
            // Agregamos los datos el usuario y contraseña encriptado a la bd
            const fecha = Date.now()
            const newDoc = {
                idusuario,
                tipo_doc,
                doc,
                estado,
                f_created: new Date(fecha)
            }
            const insertarDoc = await pool.query('INSERT INTO docs SET ?', [newDoc]);
            return res.status(201).send({ Message: 'se creó correctamente!', doc: insertarDoc });

        } catch (error) {
            console.error(error)
        }
    },

    //Listar Documentos
    listarDoc: async (req, res) => {
        try {
            const getDoc = await pool.query('SELECT *FROM docs');
            if (getDoc.length > 0)
                return res.status(200).send({ documentos: getDoc });
            res.status(404).send({ message: 'No hay documentos para mostrar' });
        } catch (error) {
            console.error(error);
        }
    },
    //Obtener un usuario
    obtenerUnDoc: async (req, res) => {
        const { id } = req.params;
        try {
            const getUnUsuario = await pool.query('SELECT * FROM docs where iddocumentos=?', [id]);
            if (getUnUsuario.length > 0)
                return res.status(200).send({ documento: getUnUsuario });
            res.status(404).send({ Message: 'El documento no existe' });
        } catch (error) {
            console.error(error);
        }
    },
    //Editar un documento
    editarDoc: async (req, res) => {
        const { id } = req.params;
        const { idusuario, tipo_doc, doc, estado } = req.body;
        try {
            const fecha = Date.now()
            const newDoc = {
                idusuario,
                tipo_doc,
                doc,
                estado,
                f_updated: new Date(fecha)
            }
            //Verificamos que el documento a editar exista, es decir que el id sea válido
            consultarDoc = await pool.query('SELECT *FROM docs WHERE docs.iddocumentos=?', [id]);
            if (consultarDoc.length > 0) {
                //actualizamos el documento
                await pool.query('UPDATE docs set ? WHERE iddocumentos=?', [newDoc, id]);
                return res.status(201).send({ Message: 'Actualizado correctamente!' });
            }
            res.status(404).send({ Message: 'El ID del usuario no existe; o fue eliminado' });
        } catch (error) {
            console.error(error);
        }
    },
    //Eliminar un documento
    eliminarDoc: async (req, res) => {
        const { id } = req.params;
        //verificamos si el documento a eliminar existe
        const consultarDoc = await pool.query('SELECT *FROM docs WHERE docs.iddocumentos=?', [id]);
        if (consultarDoc.length > 0) {
            //Eliminamos un documento
            await pool.query('DELETE FROM docs WHERE docs.iddocumentos=?', [id]);
            return res.status(200).send({ Message: 'Se eliminó correctamente' });
        }
        res.status(404).send({ Message: 'El usuario no existe o ya se eliminó' });
    }
};