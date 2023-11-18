

/**clase que se comunica con la base de datos */
class Aspirante_model{

    async getAllAspirantes(){//(nombreTabla) {    
        try {
           
            const tableNamePlural = this.validator.paramToPlurar(nombreTabla);
            console.warn('Valores Recibidos en el modelo:',nombreTabla);
            console.log(`======== tabla Para Traer:${tableNamePlural} ========`);
    
            if(tableNamePlural){
                 /**Conectando a base de datos */
                await db.connect();
    
                /**definiendo la consulta una consulta */
                const query = `SELECT * FROM ${tableNamePlural}`;
    
                console.log(`- - - consulta Enviada:${query} - - - `);
                const result = await db.query(query);
    
                await db.close();
                return result;
            }else{
                return 'no se recibio un nombre de tabla';
            }
    
            /**guardando resultado de la consulta. se envia el query. */
            //const result = await db.query(query);
            
        
            /**retorna el elemento */
            //return result;
        } catch (error) {
            console.error(':::: ERROR :::: En Modelo getAllTables');
            return `:::: ERROR :::: En Modelo getAllTables`;
            //throw error;
        }
    }

}

