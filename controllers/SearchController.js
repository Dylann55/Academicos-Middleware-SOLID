
class Search {
    constructor() { }
    // Método con implementación predeterminada
    async Search() {
        throw new Error("Sobreescribir obtener la funcion de Busqueda");
    }
}

class Search_Single_Supabase extends Search {
    constructor(database, table, select, variable_search) {
        super();
        this.table = table;
        this.select = select;
        this.variable_search = variable_search;
        this.DataBase = database;
    }
    async Search(variable) {
        // Obtener los archivos relacionados
        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase
            .from(this.table)
            .select(this.select)
            .eq(this.variable_search, variable)
            .single();

        if (error) {
            return null;
        }
        return data[this.select];
    }
}

class Search_Multiple_Supabase extends Search {
    constructor(database, table, select, variable_search) {
        super();
        this.table = table;
        this.select = select;
        this.variable_search = variable_search;
        this.DataBase = database;
    }
    async Search(variable) {
        // Obtener los archivos relacionados
        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase
            .from(this.table)
            .select(this.select)
            .eq(this.variable_search, variable);

        if (error) {
            return null;
        }

        return data.map((item) => item[this.select]);
    }
}

module.exports = { Search_Single : Search_Single_Supabase,  Search_Multiple : Search_Multiple_Supabase };