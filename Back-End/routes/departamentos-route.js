var express = require('express');
//var aspirantesModel = require('../models/aspirantes-model');
//const { Result } = require('postcss');
var departamentosModel = require('../models/departamentos-model');

var router = express.Router(); // en lugar de app usar router.

router.get('/',async (req,res)=>{
    let msj = '';
    listadepartamentosJson= await departamentosModel.getAllDepartamentos();
    if(listadepartamentosJson){
        msj='correcto';     
    }else{
        msj='error'
    } 
    res.send({
        'msj':msj,
        'result':listadepartamentosJson
    });

});

//evaluarAspirantes();
/**y se exporta todo el objeto completo.*/
module.exports = router;