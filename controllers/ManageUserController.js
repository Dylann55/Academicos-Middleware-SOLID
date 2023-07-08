class Manage_Login {
    constructor() { }
    async Manage_Login() {
        throw new Error("Sobreescribir para poder loguearse");
    }
}

class Manage_Login_Supabase extends Manage_Login {
    constructor(login, decodetoken, generatetoken, search_single) {
        super();
        this.Login = login;

        this.DecodeToken = decodetoken;
        this.GenerateToken = generatetoken;

        this.Search_Single = search_single;
    }

    async Manage_Login(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No se proporcionó el token de autorización' });
            }
            //Desencripto lo recibido
            const decoded = await this.DecodeToken.DecodeToken(token);

            const email = decoded.email;
            const password = decoded.pass;

            const result = await this.Login.Login(email, password);
            const { data, error } = result

            if (error) {
                console.log(error.message);
                const payload = "Credenciales no validas";

                const respuesta = await this.GenerateToken.Generate(payload)
                return res.json(respuesta);
            } else {
                //Se busca el id del email de la tabla usuaraiopara devolverlo al cliente
                const id = await this.Search_Single.Search(email)
                const payload = {
                    result: result,
                    id: id
                }

                const respuesta = await this.GenerateToken.Generate(payload)
                return res.json(respuesta)
            }
        }
        catch (error) {
            console.error('Error Searching etiquetas:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Manage_Register {
    constructor() { }
    async Manage_Register() {
        throw new Error("Sobreescribir para poder registrarse");
    }
}

class Manage_Register_Supabase extends Manage_Register {
    constructor(register, create_usuario, decodetoken, generatetoken) {
        super();
        this.Register = register;
        this.Create_Usuario = create_usuario;

        this.DecodeToken = decodetoken;
        this.GenerateToken = generatetoken;
    }

    async Manage_Register(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No se proporcionó el token de autorización' });
            }
            //Desencripto lo recibido
            const decoded = await this.DecodeToken.DecodeToken(token);

            const email = decoded.email;
            const password = decoded.password;

            const { data, error } = await this.Create_Usuario.Create(email, res);

            if (error) {
                console.log(error.message);
                return res.status(500).json({ error: 'Error creating usuario' });
            }

            const { data2, error2 } = await this.Register.Register(email, password);

            if (error2) {
                console.log(error.message);
                return res.status(500).json({ error: 'Error creating usuario' });
            }
            else {
                console.log("Registrado Correctamente")

                const payload = "Registro completado";

                const respuesta = await this.GenerateToken.Generate(payload)
                res.json(respuesta);
            }

        }
        catch (error) {
            console.error('Error Creating etiquetas:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Verify_Administrator {
    constructor(decodetoken, generatetoken, search_single) {
        this.DecodeToken = decodetoken;
        this.GenerateToken = generatetoken;
        this.Search_Single = search_single;
    }
    async Verify(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            const decoded = await this.DecodeToken.DecodeToken(token);

            const userRole = await this.Search_Single.Search(decoded);

            if (userRole === 'Administrador') {
                // El usuario es administrador, realizar la acción de envío de correo
                // Aquí puedes agregar la lógica para enviar el correo electrónico
                res.json({ message: 'Correo enviado correctamente.' });
            } else {
                // El usuario no es administrador, devuelve una respuesta de acceso denegado
                res.status(403).json({ message: 'Acceso denegado.' });
            }
        } catch (error) {
            console.error('Error de búsqueda:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

class Search_Role {
    constructor(decodetoken, generatetoken, search_single) {
        this.DecodeToken = decodetoken;
        this.GenerateToken = generatetoken;

        this.Search_Single = search_single;
    }

    async Search_Role(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            const decoded = await this.DecodeToken.DecodeToken(token);

            const userRole = await this.Search_Single.Search(decoded);

            const respuesta = await this.GenerateToken.Generate(userRole)
            return res.json(respuesta)

        } catch (error) {
            console.error('Error de búsqueda:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = { Manage_Login: Manage_Login_Supabase, Manage_Register: Manage_Register_Supabase, Verify_Administrator, Search_Role };