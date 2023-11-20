validator = require('../controllers/validator');

class AspiranteDTO {
    constructor() {
        
        this.primer_nombre = null;
        this.segundo_nombre = null;
        this.primer_apellido = null;
        this.segundo_apellido = null;
        this.carrera_principal = null;
        this.carrera_secundaria = null;
        this.numero_identidad = null;
        this.foto_certificado_secundaria = 0;//certificadoSecundaria
        this.telefono = null;
        this.id_centro = null; //centroRegional
        this.correo = null; //correo personal
        //this.correoInstitucional = null;
        //this.estado = null;
    }

    /**recibe el aspirante en formato JSON y devuelve una instancia de aspiranteDTO con los datos seteados.
     * en caso que algun dato sea nulo o invaldo, devuelve null.
    */
    verify(aspiranteJson){

        /**validar que sea un objeto JSON */
        if(aspiranteJson!== null && typeof aspiranteJson === 'object' && !Array.isArray(aspiranteJson)){
            
        }else{
            return null;
        }

        /**validar identidad */
        let identidad = aspiranteJson.identidad;
        if(validator.identidad(identidad)==true && identidad != null){
            this.numero_identidad = identidad;
        }else{
            return null;
        }

        /**validar nombres y apellidos */
        let primer_nombre = aspiranteJson.p_nombre, segundo_nombre = aspiranteJson.s_nombre, //nombres
        primer_apellido= aspiranteJson.p_apellido, segundo_apellido = aspiranteJson.s_apellido;//apellidos
        if(
            validator.nombre(primer_nombre)==true && primer_nombre!= null &&
            validator.nombre(segundo_nombre)==true && segundo_nombre!= null &&
            validator.apellido(primer_apellido)==true && primer_apellido!= null &&
            validator.apellido(segundo_apellido)==true && segundo_apellido!= null 
        ){
            this.primer_nombre = primer_nombre;
            this.segundo_nombre = segundo_nombre;
            this.primer_apellido = primer_apellido;
            this.segundo_apellido = segundo_apellido;
        }else{return null;}

        /**validar carreras */
        if(
            validator.carrera(aspiranteJson.carrera_P) == true && aspiranteJson.carrera_P!=null &&
            validator.carrera(aspiranteJson.carrera_S) == true && aspiranteJson.carrera_S!=null
        ){
            this.carrera_principal = aspiranteJson.carrera_P;
            this.carrera_secundaria = aspiranteJson.carrera_S;
        }else{
            return null;
        }


        /**validar celular  */
        let celular = (aspiranteJson.cel).replace("-","");
        if( 
            validator.celular(celular) && celular !=null
        ){
            this.telefono = celular
        }else{return null;}

        /**validar centroRegional */
        if(
            validator.centroRegional(aspiranteJson.centroRegional) && aspiranteJson.centroRegional!=null
        ){
            this.id_centro = aspiranteJson.centroRegional;
        }
        /**validar crreo */
        if(
            validator.correo(aspiranteJson.correoPersonal) && aspiranteJson.correoPersonal != null
        ){
            this.correo = aspiranteJson.correoPersonal;
        }
        let centro= aspiranteJson.centroRegional;
        if(
            validator.centroRegional(centro) && centro!=null
        ){
            this.id_centro = centro;
        }
        /**retornar una cadena con un msj o true/false o null */
        return this;
    }

    getPrimerNombre() {
        return this.primer_nombre;
    }

    setPrimerNombre(valor) {
        this.primerNombre = valor;
    }

    getSegundoNombre() {
        return this.segundo_nombre;
        
    }

    setSegundoNombre(valor) {
        this.segundoNombre = valor;
    }

    getPrimerApellido() {
        return this.primer_apellido;
    }

    setPrimerApellido(valor) {
        this.primerApellido = valor;
    }

    getSegundoApellido() {
        
        return this.segundo_apellido;
        
    }

    setSegundoApellido(valor) {
        this.segundoApellido = valor;
    }

    getCarreraPrincipal() {
        return this.carrera_principal;
        
    }

    setCarreraPrincipal(valor) {
        this.carreraPrincipal = valor;
    }

    getCarreraSecundaria() {
        return this.carrera_secundaria;
        
    }

    setCarreraSecundaria(valor) {
        this.carreraSecundaria = valor;
    }

    getNumero_identidad() {
        return this.numero_identidad;
    }

    setNumero_Identidad(valor) {
        this.identidad = this.numero_identidad;
    }

    getFoto_certificado_secundaria() {
        return this.foto_certificado_secundaria;
        
    }

    setFoto_certificado_secundaria(valor) {
        this.foto_certificado_secundaria= valor;
    }

    getTelefono() {
        return this.telefono;
    }

    setTelefono(valor) {
        this.telefono = valor;
    }

    getId_centro() {
        return this.id_centro;
    }

    setId_centro(valor) {
        this.id_centro= valor;
    }

    getCorreoPersonal() {
        return this.correo;
    }

    setCorreoPersonal(valor) {
        this.correo = valor;
    }


    setCorreoInstitucional(valor) {
        this.correo = valor;
    }
    getCorreo() {
        return this.correo;
    }
    setCorreo(valor) {
        this.correo = valor;
    }

    setCorreoInstitucional(valor) {
        this.correoInstitucional = valor;
    }

    getEstado() {
        return this.estado;
    }

    setEstado(valor) {
        this.estado = valor;
    }

    toString() {
        return `AspiranteDTO {
            Primer Nombre: ${this.primer_nombre},
            Segundo Nombre: ${this.segundo_nombre},
            Primer Apellido: ${this.primer_apellido},
            Segundo Apellido: ${this.segundo_apellido},
            Carrera Principal: ${this.carrera_principal},
            Carrera Secundaria: ${this.carrera_secundaria},
            Número de Identidad: ${this.numero_identidad},
            Foto de Certificado de Secundaria: ${this.foto_certificado_secundaria},
            Teléfono: ${this.telefono},
            ID del Centro Regional: ${this.id_centro},
            Correo Personal: ${this.correo}
        }`;
    }
}
module.exports = new AspiranteDTO();