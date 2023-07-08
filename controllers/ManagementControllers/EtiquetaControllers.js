const { Show, Create, Update, Delete, Filter, Selection } = require('./ManagementControllers');

class Show_Supabase_Etiqueta extends Show {
    constructor(database) {
        super();
        this.DataBase = database;
    }

    async Show(res) {
        const supabase = await this.DataBase.connect();
        const { data, error } = await supabase.from('etiqueta').select('*');
        if (error) {
            return res.status(500).json({ error: 'Error fetching etiqueta' });
        }
        res.json(data);
    }
}

class Create_Supabase_Etiqueta extends Create {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Create(etiqueta, description, usuario_id, categoria, res) {
        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase
            .from('etiqueta')
            .insert({ etiqueta, description, usuario_id, categoria });
        if (error) {
            return res.status(500).json({ error: 'Error creating etiqueta' });
        }
        res.json({ message: 'Registro creado exitosamente' });
    }
}

class Update_Supabase_Etiqueta extends Update {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Update(id, etiqueta, description, categoria, res) {
        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase
            .from('etiqueta')
            .update({ etiqueta, description, categoria })
            .eq('id', id);
        if (error) {
            return res.status(500).json({ error: 'Error updating etiqueta' });
        }
        res.json({ message: 'Registro actualizado exitosamente' });
    }
}

class Delete_Supabase_Etiqueta extends Delete {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Delete(id, res) {
        const supabase = await this.DataBase.connect();

        // Eliminar la etiqueta y los archivos relacionados en la base de datos
        const { data, error } = await supabase
            .from('etiqueta')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting etiqueta:', error.message);
            return res.status(500).json({ archivoError: 'Error deleting etiqueta' });
        }
        console.log('Etiqueta and related archivos deleted successfully');
        res.json({ message: 'Etiqueta y archivos relacionados eliminados' });
    }
}

class Filter_Supabase_Etiqueta extends Filter {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Filter(etiqueta, categoria, res) {
        const supabase = await this.DataBase.connect();

        let query = supabase.from('etiqueta').select('*');

        if (etiqueta && categoria) {
            query = query.ilike('etiqueta', `%${etiqueta}%`).eq('categoria', categoria);
        } else if (etiqueta) {
            query = query.ilike('etiqueta', `%${etiqueta}%`);
        } else if (categoria) {
            query = query.eq('categoria', categoria);
        }

        // Realizar la consulta a la tabla "etiqueta"
        const { data, error } = await query;

        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(data); // Enviar los resultados como respuesta (puedes ajustarlo según tus necesidades)
        }
    }
}

class Selection_Supabase_Etiqueta extends Selection {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Selection(res) {
        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase.from('etiqueta').select('categoria');
        if (error) {
            return res.status(500).json({ error: 'Error fetching categoria' });
        }
        const categoriasUnicas = [...new Set(data.map(item => item.categoria))];
        res.json(categoriasUnicas);
    }
}

module.exports = {
    Show_Etiqueta: Show_Supabase_Etiqueta,
    Create_Etiqueta: Create_Supabase_Etiqueta,
    Update_Etiqueta: Update_Supabase_Etiqueta,
    Delete_Etiqueta: Delete_Supabase_Etiqueta,
    Filter_Etiqueta: Filter_Supabase_Etiqueta,
    Selection_Etiqueta: Selection_Supabase_Etiqueta
}