const express = require('express')
const cors =require('cors')
const {dbConnection} = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
                auth:       '/api/auth',
                buscar:     '/api/buscar',
                categorias: '/api/categoria',
                usuarios:   '/api/usuarios',
                productos:  '/api/productos',
                uploads:    '/api/uploads',
        }
        

        // Conectar a base de datos 
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use(cors());

        //lectura y Parseo de la data  
        this.app.use(express.json());

        // Directorio publico
        this.app.use( express.static('public') );

        // Manejar la carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }
    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        this.app.use(this.paths.categorias, require('../routes/categorias'))
        this.app.use(this.paths.usuarios, require('../routes/usuarios'))
    }
    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server run in port', this.port);
        })
    }
}

module.exports=Server