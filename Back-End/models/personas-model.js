var db = require('../conections/database');

class personasModel{
    constructor(){

    }
    
    /**funcion que valida si una persona existe(return true) o no(false).  */
    async existePersona(idPersona) {
        let existe = false; // Asumimos inicialmente que la persona no existe
        try {
            await db.connect();
            let resultado = await db.query(`SELECT COUNT(*) cantidad FROM personas p WHERE p.numero_identidad = '${idPersona}';`);
            let cantidad = resultado[0].cantidad;
            console.log('EXIST::', cantidad);
            if (cantidad > 0) {
                existe = true; // Cambiamos a true si encontramos la persona
            }
        } catch (error) {
            console.error('Error al verificar la existencia de la persona:', error);
            // Puedes manejar el error como consideres apropiado aquí
        } finally {
            await db.close();
        }
        return existe; // Devolvemos el resultado fuera del bloque finally
    }
    
}

module.exports = new personasModel();