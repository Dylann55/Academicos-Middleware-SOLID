class Login {
    constructor() {
    }
    // Método con implementación predeterminada
    async Login() {
        throw new Error("Sobreescribir poder Loguearse");
    }
}

class Login_Supabase extends Login {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    async Login(email, password) {
        const supabase = await this.DataBase.connect();
        const result = await supabase.auth.signInWithPassword({
            email : email,
            password : password
        });
        return result;
    }
}

class Register {
    constructor() {
    }
    // Método con implementación predeterminada
    async Register() {
        throw new Error("Sobreescribir para poder Registrarse");
    }
}

class Register_Supabase extends Register {
    constructor(database) {
        super();
        this.DataBase = database;
    }
    async Register(email, password) {
        const supabase = await this.DataBase.connect();

        return { data, error } = await supabase.auth.signUp({
            email : email,
            password : password
        });
    }
}


module.exports = {
    Login_User: Login_Supabase,
    Register_User: Register_Supabase
}