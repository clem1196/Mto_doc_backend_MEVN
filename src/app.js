
// src/app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Configurar puerto
const PORT = process.env.PORT || 4000;
//middlewares
app.use(bodyParser.json());
app.use(cors());
//Agregar rutas
app.use('/api', (
    [
        require('./routes/inicio'),
        require('./routes/usuarios'),
        require('./routes/roles'),
        require('./routes/usuarios_roles'),
        require('./routes/documentos')
    ]
));

// corriendo el servidor
app.listen(PORT, () => console.log(`El servidor esta corriendo en el puerto ${PORT}`));  
