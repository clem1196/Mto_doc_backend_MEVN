// src/routes/router.js
const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    res.json({message:'Est el el contenido de inicio!'})
});
module.exports = router;