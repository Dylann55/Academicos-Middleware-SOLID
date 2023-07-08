const { Show, Create, Update} = require('./ManagementControllers');

class Show_Supabase_Usuario extends Show {
    constructor(database) {
        super();
        this.DataBase = database;
    }

    async Show(res) {
        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase.from('usuario').select('*');
        if (error) {
            return res.status(500).json({ error: 'Error seaching usuario' });
        }
        if (!data) {
            return res.status(404).json({ message: 'No se encontraron usuarios' });
        }
        res.json(data);
    }
}

class Create_Supabase_Usuario extends Create {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Create(email, res) {
        const supabase = await this.DataBase.connect();
        const role = 'Alumno'

        return { data, error } = await supabase
            .from('usuario')
            .insert({ email, role });
    }
}

class Update_Supabase_Usuario extends Update {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    // Método con implementación predeterminada
    async Update(id, role, res) {
        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase
            .from('usuario')
            .update({ role })
            .eq('id', id);

        if (error) {
            return res.status(500).json({ error: 'Error update usuario' });
        }
        res.json({ message: 'Rol del usuario actualizado exitosamente' });
    }
}

module.exports = {
    Show_Usuario: Show_Supabase_Usuario,
    Create_Usuario: Create_Supabase_Usuario,
    Update_Usuario: Update_Supabase_Usuario
}