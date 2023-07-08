const { Show, Create, Update, Delete, Filter, Selection } = require('./RoutesController');

class Show_Etiqueta_Route extends Show {
    constructor(show_etiqueta) {
        super();
        this.Show_Etiqueta = show_etiqueta;
    }

    async Show(req, res) {
        try {
            await this.Show_Etiqueta.Show(res);
        } catch (error) {
            console.error('Error fetching etiquetas:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Create_Etiqueta_Route extends Create {
    constructor(create_etiqueta) {
        super();
        this.Create_Etiqueta = create_etiqueta;
    }
    // Método con implementación predeterminada
    async Create(req, res) {
        try {
            const { etiqueta, description, categoria, usuario_id } = req.body;
            await this.Create_Etiqueta.Create(etiqueta, description, usuario_id, categoria, res);
        } catch (error) {
            console.error('Error creating etiquetas:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Update_Etiqueta_Route extends Update {
    constructor(update_etiqueta) {
        super();
        this.Update_Etiqueta = update_etiqueta;
    }
    // Método con implementación predeterminada
    async Update(req, res) {
        try {
            const { id } = req.params;
            const { etiqueta, description, categoria } = req.body;
            await this.Update_Etiqueta.Update(id, etiqueta, description, categoria, res);
        } catch (error) {
            console.error('Error updating etiquetas:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Delete_Etiqueta_Route extends Delete {
    constructor(delete_etiqueta, search_multiple, delete_storage) {
        super();
        this.Delete_Etiqueta = delete_etiqueta;
        this.Search_Multiple = search_multiple;
        this.Delete_Storage = delete_storage;
    }
    // Método con implementación predeterminada
    async Delete(req, res) {
        try {
            const { id } = req.params;

            const urls = await this.Search_Multiple.Search(id);

            urls.forEach(async (url) => {
                const blobName = url.split('/').pop(); // Obtener el nombre del archivo del URL
                await this.Delete_Storage.Delete(blobName);
            });

            await this.Delete_Etiqueta.Delete(id, res);
        } catch (error) {
            console.error('Error deleting etiquetas:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Filter_Etiqueta_Route extends Filter {
    constructor(filter_etiqueta) {
        super();
        this.Filter_Etiqueta = filter_etiqueta;
    }
    // Método con implementación predeterminada
    async Filter(req, res) {
        try {
            const etiqueta = req.query.etiqueta;
            const categoria = req.query.categoria;
            await this.Filter_Etiqueta.Filter(etiqueta, categoria, res);
        } catch (error) {
            console.error('Error filtering etiquetas:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Selection_Etiqueta_Route extends Selection {
    constructor(selection_etiqueta) {
        super();
        this.Selection_Etiqueta = selection_etiqueta;
    }
    // Método con implementación predeterminada
    async Selection(req, res) {
        try {
            await this.Selection_Etiqueta.Selection(res);
        } catch (error) {
            console.error('Error selecting etiquetas:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = {
    Show_Etiqueta_Route,
    Create_Etiqueta_Route,
    Update_Etiqueta_Route,
    Delete_Etiqueta_Route,
    Filter_Etiqueta_Route,
    Selection_Etiqueta_Route
}