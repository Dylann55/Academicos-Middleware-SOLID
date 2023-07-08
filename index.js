require("dotenv").config(); // Cargar variables de entorno desde un archivo .env

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*', // Asegúrate de que este origen coincida con el de tu cliente
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

//-------------------------------Clases Bases-------------------------------
const { DecodeToken, GenerateToken } = require('./controllers/JwtController');
const { Data_Base } = require('./controllers/DataBaseController');
const { Create_Storage, Update_Storage, Delete_Storage} = require('./controllers/StorageController');
const { Search_Single, Search_Multiple } = require('./controllers/SearchController');


const database = new Data_Base();

const decodetoken = new DecodeToken();
const generatetoken = new GenerateToken();

const create_storage = new Create_Storage();
const update_storage = new Update_Storage();
const delete_storage = new Delete_Storage();

//-------------------------------Rutas para las Loguearse y Registrarse-------------------------------
const search_single_login = new Search_Single(database, 'usuario', 'id', 'email');

const { Login_User, Register_User } = require('./controllers/ManagementControllers/UserController');
const { Create_Usuario } = require('./controllers/ManagementControllers/UsuarioControllers');
const login = new Login_User(database);
const register = new Register_User(database);
const create_usuario = new Create_Usuario(database);

const { Manage_Login, Manage_Register } = require('./controllers/ManageUserController');
const manage_login = new Manage_Login(login, decodetoken, generatetoken, search_single_login);
const manage_register = new Manage_Register(register, create_usuario, decodetoken, generatetoken);

// Ruta protegida para loguearse
app.post('/', manage_login.Manage_Login.bind(manage_login));

// Ruta protegida para registrarse
app.post('/registro', manage_register.Manage_Register.bind(manage_register));

//-------------------------------Rutas para el CRUD con la tabla "etiqueta"-------------------------------
const search_multiple_Etiqueta = new Search_Multiple(database, 'archivo', 'url_azura', 'etiqueta_id');

const { Show_Etiqueta,Create_Etiqueta,Update_Etiqueta,Delete_Etiqueta,Filter_Etiqueta,Selection_Etiqueta } = require('./controllers/ManagementControllers/EtiquetaControllers');
const show_etiqueta = new Show_Etiqueta(database);
const create_etiqueta = new Create_Etiqueta(database);
const update_etiqueta = new Update_Etiqueta(database);
const delete_etiqueta = new Delete_Etiqueta(database);
const filter_etiqueta = new Filter_Etiqueta(database);
const selection_etiqueta = new Selection_Etiqueta(database);

const { Show_Etiqueta_Route,Create_Etiqueta_Route,Update_Etiqueta_Route,Delete_Etiqueta_Route,Filter_Etiqueta_Route,Selection_Etiqueta_Route } = require('./controllers/ManageEtiquetaController');
const show_etiqueta_route = new Show_Etiqueta_Route(show_etiqueta);
const create_etiqueta_route = new Create_Etiqueta_Route(create_etiqueta);
const update_etiqueta_route = new Update_Etiqueta_Route(update_etiqueta);
const delete_etiqueta_route = new Delete_Etiqueta_Route(delete_etiqueta, search_multiple_Etiqueta, delete_storage);
const filter_etiqueta_route = new Filter_Etiqueta_Route(filter_etiqueta);
const selection_etiqueta_route = new Selection_Etiqueta_Route(selection_etiqueta);

// Obtener registros
app.get('/etiquetas', show_etiqueta_route.Show.bind(show_etiqueta_route));

// Crear un registro
app.post('/etiquetas', create_etiqueta_route.Create.bind(create_etiqueta_route));

// Actualizar un registro
app.put('/etiquetas/:id', update_etiqueta_route.Update.bind(update_etiqueta_route));

// Eliminar una etiqueta
app.delete('/etiquetas/:id', delete_etiqueta_route.Delete.bind(delete_etiqueta_route));

//Filtrar elementos de etiqueta mediante etiqueta y categoria
app.get('/filtrar', filter_etiqueta_route.Filter.bind(filter_etiqueta_route));

// Obtener categorias
app.get('/categoria', selection_etiqueta_route.Selection.bind(selection_etiqueta_route));

//-------------------------------Rutas para el CRUD con la tabla "archivo"-------------------------------

const search_single_archivo = new Search_Single(database, 'archivo', 'url_azura', 'id');

const { Show_Archivo,Create_Archivo,Update_Archivo,Delete_Archivo,Filter_Archivo,Selection_Archivo } = require('./controllers/ManagementControllers/ArchivoControllers');
const show_archivo = new Show_Archivo(database);
const create_archivo = new Create_Archivo(database);
const update_archivo = new Update_Archivo(database);
const delete_archivo = new Delete_Archivo(database);
const filter_archivo = new Filter_Archivo(database);
const selection_archivo = new Selection_Archivo(database);

const { Show_Archivo_Route,Create_Archivo_Route,Update_Archivo_Route,Delete_Archivo_Route,Filter_Archivo_Route,Selection_Archivo_Route } = require('./controllers/ManageArchivoController');
const show_archivo_route = new Show_Archivo_Route(show_archivo);
const create_archivo_route = new Create_Archivo_Route(create_archivo, create_storage);
const update_archivo_route = new Update_Archivo_Route(update_archivo, update_storage, search_single_archivo);
const delete_archivo_route = new Delete_Archivo_Route(delete_archivo,  delete_storage, search_single_archivo);
const filter_archivo_route = new Filter_Archivo_Route(filter_archivo);
const selection_archivo_route = new Selection_Archivo_Route(selection_archivo);

// Obtener registros
app.get('/archivo', show_archivo_route.Show.bind(show_archivo_route));

// Crear un registro
app.post('/archivo', upload.single('file'), create_archivo_route.Create.bind(create_archivo_route));

// Actualizar un registro
app.put('/archivo/:id', upload.single('file'), update_archivo_route.Update.bind(update_archivo_route));

// Eliminar un registro
app.delete('/archivo/:id', delete_archivo_route.Delete.bind(delete_archivo_route));

//Filtrar elementos de archivo mediante nombre del archivo y formato
app.get('/filtrar_archivo', filter_archivo_route.Filter.bind(filter_archivo_route));

//Obtener Formatos
app.get('/formato', selection_archivo_route.Selection.bind(selection_archivo_route));


//-------------------------------Rutas para las Funciones de roles-------------------------------
const search_single_verify = new Search_Single(database, 'usuario', 'role', 'id');

const { Verify_Administrator,Search_Role } = require('./controllers/ManageUserController');
const verify_administrator = new Verify_Administrator(decodetoken, generatetoken, search_single_verify);
const search_role = new Search_Role(decodetoken, generatetoken ,search_single_verify);

const { Show_Usuario, Update_Usuario } = require('./controllers/ManagementControllers/UsuarioControllers');
const show_usuario = new Show_Usuario(database);
const update_usuario = new Update_Usuario(database);

const { Show_Usuario_Route, Update_Usuario_Route } = require('./controllers/ManageUsuarioController');
const show_usuario_route = new Show_Usuario_Route(show_usuario);
const update_usuario_route = new Update_Usuario_Route(update_usuario,decodetoken);

//Verificar que el usuario es administrador
app.post("/admin", verify_administrator.Verify.bind(verify_administrator));

//Buscar el Rol del Usuario
app.get("/buscar", search_role.Search_Role.bind(search_role));

//Obtener los Datos del usuario
app.get('/usuario', show_usuario_route.Show.bind(show_usuario_route));

//Cambiar el rol de un Usuario determinado
app.put('/usuario/:id', update_usuario_route.Update.bind(update_usuario_route));


app.listen(4041, () => {
  console.log('Servidor iniciado en el puerto 4041');
});