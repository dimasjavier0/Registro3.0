/**lista de querys */
class HandlerQuerys{
    constructor(){
        this.querys={
            aspirante:{
                select:'',
                insert:[`EXEC [dbo].[agregar_aspirante] `,11],
                update:'',
                delete:''
            }
        
        };
    }
    getQueryToInsert(tableName,data){
        switch (tableName) {
            case 'aspirante':
                return ``;
                break;
            default:
                return ``;
                break;
            
        }
    }

}
module.exports = new HandlerQuerys();