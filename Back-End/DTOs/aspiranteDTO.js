validator = require('../controllers/validator');

class AspiranteDTO {
    constructor(){

    }
    setAspiranteDTO(aspiranteJson) {
        this.primer_nombre = aspiranteJson.p_nombre || null;
        this.segundo_nombre = aspiranteJson.s_nombre || null;
        this.primer_apellido = aspiranteJson.p_apellido || null;
        this.segundo_apellido = aspiranteJson.s_apellido || null;
        this.carrera_principal = aspiranteJson.carrera_P || null;
        this.carrera_secundaria = aspiranteJson.carrera_S || null;
        this.numero_identidad = aspiranteJson.identidad || null;
        this.foto_certificado_secundaria = aspiranteJson.foto || 0; // Asumiendo que 'foto' es el certificado de secundaria
        this.telefono = aspiranteJson.cel || null;
        this.id_centro = aspiranteJson.centroRegional || null;
        this.correo = aspiranteJson.correoPersonal || null;
        // Asumiendo que 'estado' no se utiliza directamente en esta clase
        this.mensaje = 'Aspirante creado correctamente';
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
            msj: ${this.mensaje}
        }`;
    }

    getMensaje(){
        return this.mensaje;
    }
}
module.exports = new AspiranteDTO();