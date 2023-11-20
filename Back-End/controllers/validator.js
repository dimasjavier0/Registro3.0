class Validator {
    constructor(){}

    // Valida un número de identidad (podría ser un DNI, SSN, etc.)
    identidad(identidad) {
        const regex = /(\d{4})((19([4-9]){1}(\d))|(2(\d){3}))(\d{5})/; // segun la cantidad de digitos
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
        return regex.test(carrera) && carrera.length <= 50;
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

    
}
module.exports = new Validator();