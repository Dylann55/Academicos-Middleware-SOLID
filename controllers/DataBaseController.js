require("dotenv").config(); // Cargar variables de entorno desde un archivo .env
const { createClient } = require('@supabase/supabase-js');

class DataBase {
    constructor() {
    }
    // Método con implementación predeterminada
    async connect() {
        throw new Error("Sobreescribir obtener la instancia de Base de datos");
    }
}

class SupaBase extends DataBase {
    constructor() {
        super();
        // Datos de conexión a la primera base de datos
        this.supabaseUrl1 = process.env.supabaseUrl1;
        this.supabaseAnonKey1 = process.env.supabaseKey1;

        // Datos de conexión a la segunda base de datos
        this.supabaseUrl2 = process.env.supabaseUrl2;
        this.supabaseAnonKey2 = process.env.supabaseKey2;
    }

    async connect() {
        try {
            // Conexión a la primera base de datos
            const supabase1 = createClient(this.supabaseUrl1, this.supabaseAnonKey1);
            const { data, error1 } = await supabase1.from('status').select();
            console.log('error: %o', error1);
            console.log('data: %o', data);
            if (data != null) {
                console.log('Conectado a la base de datos 1');
                return supabase1;
            }
        } catch (err) {
            console.error(`Error al conectar a la base de datos 1: ${err}`);
        }

        try {
            // Conexión a la segunda base de datos
            const supabase2 = createClient(this.supabaseUrl2, this.supabaseAnonKey2);
            const { data, error2 } = await supabase2.from('etiqueta').select();
            console.log('error: %o', error2);
            console.log('data: %o', data);
            if (data != null) {
                console.log('Conectado a la base de datos 2');
                this.supabaseUrl = this.supabaseUrl1;
                this.supabaseAnonKey = this.supabaseAnonKey1;
                return supabase2;
            }
        } catch (err) {
            console.error(`Error al conectar a la base de datos 2: ${err}`);
        }
        return null;
    }
}

module.exports = {Data_Base : SupaBase};