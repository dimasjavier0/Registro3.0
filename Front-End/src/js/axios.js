class Axios{
    constructor(){
		//this.axios = axios;
        this.method = "get";
		this.url = "localhost:8888/";
		
        this.parameters ="";
        this.config="";
		/**En caso de error Que siempre retorne una respuesta en formato de json */
		this.response = "";
		this.requestHeader = "";
		//this.xhr.onload=this.action;
        this.data = {};
        this.config = {
            // por defecto es get
            method: 'get', // Puedes usar 'get', 'post', 'put', 'delete', etc.
            // por defecto el index.html
            url: `http://localhost:8888/`,
            data: this.data, // Los datos que deseas enviar en formato JSON
            headers: {
              'Content-Type': 'application/json' // Indicar que los datos son JSON
            }
        };

	}
    setAxiosInstance(axios){
        this.axios = new Axios();
    }
    /** configurar metodo de envio de la peticiones (axios,put,delete,post)
    */
    setMethod(methodString){
        this.config.method = `${methodString}`;
    }
    setPost(){
        this.config.method='post';
    }

    setGet(){
        this.config.method='get';
    }
    /**data tiene que estar en formato JSON */
    setData(data){
        this.config.data = data;
    }
    /**funcion que tengo que definir antes de enviar la peticion, y que es la que va a ejecutar cuando se complete la peticion al backend*/
    onload(){	
        console.log("EJECUTANDO FUNCION DE RESPUESTA AL COMPLETAR LA PETICION ",this.getResponse());
    }

    /** parametro para guardar la respuesta*/
    getResponse(){//(event)
		return this.response;
	}
    setUrl(urlToSendRequest){
        this.config.url = `${urlToSendRequest}`;
    }
    getUrl(urlToSendRequest){
        return this.config.url;
    }

    async send(){       
        await axios(this.config)
        .then(response => {
            //console.log('config:',this.config)
            console.log('Respuesta del servidor:', response.data);        
            
            //let array = response.data.result;//arreglo que contiene jsons, objetos/tablas respuesta.
            if(response.data.result){
                this.response = response.data.result;
            }else{
                this.response = response.data;
            }
            this.onload();
            
            //let elementosRenderizados = rs.renderElements(msjJson);//pantalla

            //rs.insertInToContainer(`container${pantalla}`,elementosRenderizados);

        })
        .catch(error => {
            console.error('Error al enviar la petición ', error);

        });
    }

}
