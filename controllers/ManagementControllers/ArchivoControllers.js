const { Show, Create, Update, Delete, Filter, Selection } = require('./ManagementControllers');

class Show_Supabase_Archivo extends Show {
    constructor(database) {
        super();
        this.DataBase = database;
    }

    async Show(id, res) {
        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase
            .from('archivo')
            .select('*')
            .eq('etiqueta_id', id);

        if (error) {
            res.status(500).json({ error: 'Error fetching archivos' });
        }

        res.json(data);
    }
}

class Create_Supabase_Archivo extends Create {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Create(usuario_id, etiqueta_id, url, formato, nombre_archivo, res) {
        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase
            .from('archivo')
            .insert([{ usuario_id, etiqueta_id, url_azura: url, formato, nombre_archivo }]);

        if (error) {
            console.error('Error creating archivo:', error.message);
            return res.status(500).json({ error: 'Error creating archivo' });
        }
        console.log('Archivo creado exitosamente');
        res.json({ message: 'Registro creado exitosamente' });
    }
}

class Update_Supabase_Archivo extends Update {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Update(id, url, nombre_archivo, formato, res) {
        const supabase = await this.DataBase.connect();

        if (url === '') {
            console.log(nombre_archivo)
            const { data, error } = await supabase
                .from('archivo')
                .update({ nombre_archivo })
                .eq('id', id);
                if (error) {
                    return res.status(500).json({ error: 'Error updating archivo' });
                }
        }
        else {
            const { data, error } = await supabase
                .from('archivo')
                .update({ url_azura: url, nombre_archivo, formato })
                .eq('id', id);
                if (error) {
                    return res.status(500).json({ error: 'Error updating archivo' });
                }
        }

        console.log('Archivo actualizado exitosamente');
        res.json({ message: 'Registro actualizado exitosamente' });
    }
}

class Delete_Supabase_Archivo extends Delete {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Delete(id, res) {
        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase
            .from('archivo')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting archivo:', error.message);
            return res.status(500).json({ error: 'Error deleting archivo' });
        }
        console.log('Archivo eliminado exitosamente');
        res.json({ message: 'Archivo eliminado' });
    }
}

class Filter_Supabase_Archivo extends Filter {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Filter(id, nombre_archivo, formato, res) {
        const supabase = await this.DataBase.connect();

        let query = supabase.from('archivo').select('*').eq('etiqueta_id', id);;

        if (nombre_archivo && formato) {
            query = query.ilike('nombre_archivo', `%${nombre_archivo}%`).eq('formato', formato);
        } else if (nombre_archivo) {
            query = query.ilike('nombre_archivo', `%${nombre_archivo}%`);
        } else if (formato) {
            query = query.eq('formato', formato);
        }

        // Realizar la consulta a la tabla "nombre_archivo"
        const { data, error } = await query;

        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(data); // Enviar los resultados como respuesta (puedes ajustarlo según tus necesidades)
        }
    }
}

class Selection_Supabase_Archivo extends Selection {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Selection(id, res) {
        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase
            .from('archivo')
            .select('formato')
            .eq('etiqueta_id', id);

        if (error) {
            return res.status(500).json({ error: 'Error fetching formato' });
        }

        const formatosUnicos = [...new Set(data.map(item => item.formato))];
        res.json(formatosUnicos);
    }
}

module.exports = {
    Show_Archivo: Show_Supabase_Archivo,
    Create_Archivo: Create_Supabase_Archivo,
    Update_Archivo: Update_Supabase_Archivo,
    Delete_Archivo: Delete_Supabase_Archivo,
    Filter_Archivo: Filter_Supabase_Archivo,
    Selection_Archivo: Selection_Supabase_Archivo
}