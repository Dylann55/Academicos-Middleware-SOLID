class Show {
    constructor() { }
    // Método con implementación predeterminada
    async Show() {
        throw new Error(`Mostrar Elementos de la Base de datos`)
    }
}

class Create {
    constructor() { }
    // Método con implementación predeterminada
    async Create() {
        throw new Error("Sobreescribir obtener la funcion de Creacion");
    }
}

class Update {
    constructor() { }
    // Método con implementación predeterminada
    async Update() {
        throw new Error("Sobreescribir obtener la funcion de Actualizacion");
    }
}

class Delete {
    constructor() { }
    // Método con implementación predeterminada
    async Delete() {
        throw new Error("Sobreescribir obtener la funcion de Eliminacion");
    }
}

class Filter {
    constructor() { }
    // Método con implementación predeterminada
    async Filter() {
        throw new Error("Sobreescribir obtener la funcion de Filtrado");
    }
}

class Selection {
    constructor() { }
    // Método con implementación predeterminada
    async Selection() {
        throw new Error("Sobreescribir obtener la funcion de Seleccion");
    }
}

module.exports = { Show, Create, Update, Delete, Filter, Selection}