const mime = require('mime-types');
const uuid = require('uuid');

//56983770154

const { Show, Create, Update, Delete, Filter, Selection } = require('./RoutesController');

class Show_Archivo_Route extends Show {
    constructor(show_archivo) {
        super();
        this.Show_Archivo = show_archivo;
    }

    async Show(req, res) {
        try {
            const { id } = req.query;
            await this.Show_Archivo.Show(id, res);
        } catch (error) {
            console.error('Error fetching archivos:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Create_Archivo_Route extends Create {
    constructor(create_archivo, create_storage) {
        super();
        this.Create_Archivo = create_archivo;
        this.Create_Storage = create_storage;
    }
    // Método con implementación predeterminada
    async Create(req, res) {
        try {

            const file = req.file;
            const originalFileName = file.originalname;

            const usuario_id = req.body.usuario_id;
            const etiqueta_id = req.body.etiqueta_id;

            const mimeType = mime.lookup(originalFileName); // Obtener el tipo MIME basado en la extensión del archivo

            const url = await this.Create_Storage.Create(file, mimeType);

            const nombre_archivo = req.body.nombre_archivo || originalFileName;

            await this.Create_Archivo.Create(usuario_id, etiqueta_id, url, mimeType, nombre_archivo, res)

        } catch (error) {
            console.error('Error creating archivos:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Update_Archivo_Route extends Update {
    constructor(update_archivo, update_storage, search_single) {
        super();
        this.Update_Archivo = update_archivo;
        this.Update_Storage = update_storage;
        this.Search_Single = search_single;
    }
    // Método con implementación predeterminada
    async Update(req, res) {
        try {
            const { id } = req.params;
            const file = req.file;

            if (!file) {
                const nombre_archivo = req.body.nombre_archivo;
                await this.Update_Archivo.Update(id, '', nombre_archivo, '', res);
            }
            else {
                const originalFileName = file.originalname;

                const mimeType = mime.lookup(originalFileName); // Obtener el tipo MIME basado en la extensión del archivo

                const blobUrl = await this.Search_Single.Search(id);
                const blobName = blobUrl.substring(blobUrl.lastIndexOf('/') + 1);

                const url = await this.Update_Storage.Update(blobName, file, mimeType);

                const nombre_archivo = req.body.nombre_archivo || originalFileName;
                await this.Update_Archivo.Update(id, url, nombre_archivo, mimeType, res);
            }

        } catch (error) {
            console.error('Error updating archivos:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Delete_Archivo_Route extends Delete {
    constructor(delete_archivo, delete_storage, search_single) {
        super();
        this.Delete_Archivo = delete_archivo;
        this.Delete_Storage = delete_storage;
        this.Search_Single = search_single;
    }
    // Método con implementación predeterminada
    async Delete(req, res) {
        try {
            const { id } = req.params;

            const url = await this.Search_Single.Search(id);

            const blobName = url.split('/').pop(); // Obtener el nombre del archivo del URL
            await this.Delete_Storage.Delete(blobName);

            await this.Delete_Archivo.Delete(id, res);
        } catch (error) {
            console.error('Error deleting archivos:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Filter_Archivo_Route extends Filter {
    constructor(filter_archivo) {
        super();
        this.Filter_Archivo = filter_archivo;
    }
    // Método con implementación predeterminada
    async Filter(req, res) {
        try {
            const nombre_archivo = req.query.nombre;
            const formato = req.query.formato;
            const id = req.query.id;

            await this.Filter_Archivo.Filter(id, nombre_archivo, formato, res);
        } catch (error) {
            console.error('Error filtering archivos:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Selection_Archivo_Route extends Selection {
    constructor(selection_archivo) {
        super();
        this.Selection_Archivo = selection_archivo;
    }
    // Método con implementación predeterminada
    async Selection(req, res) {
        try {
            const { id } = req.query;
            await this.Selection_Archivo.Selection(id, res);
        } catch (error) {
            console.error('Error selecting archivos:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = {
    Show_Archivo_Route,
    Create_Archivo_Route,
    Update_Archivo_Route,
    Delete_Archivo_Route,
    Filter_Archivo_Route,
    Selection_Archivo_Route
}