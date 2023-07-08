const { Show , Update} = require('./RoutesController');

class Show_Usuario_Route extends Show {
    constructor(show_usuario) {
        super();
        this.Show_Usuario = show_usuario;
    }

    async Show(req, res) {
        try {
            await this.Show_Usuario.Show(res);
        } catch (error) {
            console.error('Error fetching usuarios:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Update_Usuario_Route extends Update {
    constructor(update_usuario,decodetoken) {
        super();
        this.Update_Usuario = update_usuario;
        this.DecodeToken = decodetoken;
    }
    // Método con implementación predeterminada
    async Update(req, res) {
        try {
            const { id } = req.params;
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            const role = await this.DecodeToken.DecodeToken(token);

            await this.Update_Usuario.Update(id, role, res);

        } catch (error) {
            console.error('Error updating usuarios:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = {
    Show_Usuario_Route,
    Update_Usuario_Route,
}