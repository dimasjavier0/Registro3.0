class Validator {
    constructor(){}

    // Valida un número de identidad (podría ser un DNI, SSN, etc.)
    identidad(identidad) {
        const regex = /(\d{4})((19([4-9]){1}(\d))|(\d(\d){3}))(\d{5})/; // segun la cantidad de digitos
        return regex.test(identidad);
    }

    // Valida un nombre (solo letras y espacios)
    nombre(nombre) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
        return regex.test(nombre) && nombre.length <= 20;
    }

    // Valida un apellido (solo letras y espacios)
    apellido(apellido) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
        return regex.test(apellido) && apellido.length <= 20;
    }

    // Valida un nombre completo (puede incluir nombres y apellidos)
    nombreCompleto(nombreCompleto) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{5,100}$/;
        return regex.test(nombreCompleto);
    }

    // Valida un nombre de carrera (solo letras, espacios y números)
    carrera(carrera) {
        const regex = /\d/ // /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/;
        return regex.test(carrera);// && carrera.length <= 50;
    }

    // Valida un correo electrónico
    correo(correo) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(correo);
    }

    // Valida un centro regional (solo letras y espacios)
    centroRegional(centro) {
        const regex = /\d{1}/;
        return regex.test(centro) && centro.length <= 50;
    }

    // Validar un celular (TIGO o claro)
    celular(celular) {
        const regex = /[39]{1}\d{7}/;
        return regex.test(celular) && celular.length == 8;
    }

    validarAspirante(aspiranteJson) {
        var parametrosInvalidos = [];
        var valido = true;
    
        // Validar que sea un objeto JSON y no nulo
        if (!(aspiranteJson && typeof aspiranteJson === 'object' && !Array.isArray(aspiranteJson))) {
            parametrosInvalidos.push('Información del aspirante recibida de manera INCORRECTA');
            valido = false;
        } else {
            // Validar identidad
            if (!aspiranteJson.identidad || !validator.identidad(aspiranteJson.identidad)) {
                parametrosInvalidos.push('Identidad No Válida');
                valido = false;
            }
        
            // Validar nombres y apellidos
            if (!aspiranteJson.p_nombre || !validator.nombre(aspiranteJson.p_nombre) ||
                !aspiranteJson.s_nombre || !validator.nombre(aspiranteJson.s_nombre) ||
                !aspiranteJson.p_apellido || !validator.apellido(aspiranteJson.p_apellido) ||
                !aspiranteJson.s_apellido || !validator.apellido(aspiranteJson.s_apellido)) 
            {
                parametrosInvalidos.push('Error al validar Nombres');
                valido = false;
            }
        
            // Validar carreras
            if (!aspiranteJson.carrera_P || !validator.carrera(aspiranteJson.carrera_P) ||
                !aspiranteJson.carrera_S || !validator.carrera(aspiranteJson.carrera_S)) 
            {
                parametrosInvalidos.push('Error al Validar Carreras');
                valido = false;
            }
        
            // Validar celular
            if (!aspiranteJson.cel || !validator.celular(aspiranteJson.cel.replace("-", ""))) {
                parametrosInvalidos.push('Celular INVALIDO');
                valido = false;
            }
        
            // Validar centroRegional y correo
            if (!aspiranteJson.centroRegional || !validator.centroRegional(aspiranteJson.centroRegional)) {
                parametrosInvalidos.push('Centro Regional Invalido');
                valido = false;
            }
        
            if (!aspiranteJson.correoPersonal || !validator.correo(aspiranteJson.correoPersonal)) {
                parametrosInvalidos.push('Correo Invalido');
                valido = false;
            }
        }
    
        // Construir mensaje basado en la validez
        var mensaje = valido ? 'Validación Exitosa' : 'Errores en la Validación';
    
        return {
            mensaje,
            result: valido,
            parametrosInvalidos
        };
    }
    
    
}
module.exports = new Validator();