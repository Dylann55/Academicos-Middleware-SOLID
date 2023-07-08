require("dotenv").config(); // Cargar variables de entorno desde un archivo .env
//azure-storage para interactuar con Azure Blob Storage.
const azure = require('azure-storage');
const mime = require('mime-types');
const uuid = require('uuid');

// Para utilizar las funciones y métodos proporcionados por el módulo 
// para realizar operaciones relacionadas con el sistema de archivos.
const fs = require('fs');

class Storage_Create {
    constructor() { }
    // Método con implementación predeterminada
    async Create() {
        throw new Error(`Sobreescribir creacion de un Blob`)
    }
}

// Clase derivada de AzuraConnection
class Create_Azura extends Storage_Create {

    constructor() {
        super();
        //nombre de la cuenta de almacenamiento y clave(no Cadena de conexión)+
        //se consiguen en Claves de acceso
        this.AccountName = process.env.AccountName;
        this.AccountKey = process.env.AccountKey;
        //nombre del contenedor en Almacenamiento de datos-> contenedores
        this.containerName = process.env.containerName;
        this.BlobService = azure.createBlobService(this.AccountName, this.AccountKey);
    }

    async Create(file, mimeType) {

        const filePath = file.path;

        const blobName = uuid.v4();

        console.log('MIME Type:', mimeType);
        const options = {
            contentSettings: {
                contentType: mimeType // Establecer el tipo MIME obtenido
            }
        };

        return new Promise((resolve, reject) => {
            this.BlobService.createBlockBlobFromLocalFile(this.containerName, blobName, filePath, options, (error) => {
                if (error) {
                    console.log('Error uploading file:', error);
                    //Pasa el catch externo
                    reject(error);
                } else {
                    //Si funciona seguira el codigo normalmente
                    const url = this.BlobService.getUrl(this.containerName, blobName)
                    resolve(url);
                }
            });
        });
    }
}

// Clase derivada de AzuraConnection
class Create_SupaBase extends Storage_Create {

    constructor(database) {
        super();
        this.DataBase = database;
        this.Bucket = process.env.Bucket;
    }

    async Create(file, mimeType) {

        const filePath = file.path;

        const fileExtension = mime.extension(file.mimetype); // Obtener la extensión del archivo según el tipo MIME
        const blobName = `${uuid.v4()}.${fileExtension}`; // Combinar el UUID y la extensión para formar el nombre del archivo

        const supabase = await this.DataBase.connect();

        const fileData = fs.readFileSync(filePath);

        const { data, error } = await supabase
            .storage
            .from(this.Bucket)
            .upload(blobName, fileData);

        if (error) {
            console.error(error);
            return null;
        }

        const url = await supabase.storage.from(this.Bucket).getPublicUrl(blobName);

        return url.data.publicUrl;
    }
}

class Storage_Update {
    constructor() { }
    // Método con implementación predeterminada
    async Update() {
        throw new Error(`Sobreescribir actualizacion de un Blob`)
    }
}

class Update_Azura extends Storage_Update {

    constructor() {
        super();
        //nombre de la cuenta de almacenamiento y clave(no Cadena de conexión)+
        //se consiguen en Claves de acceso
        this.AccountName = process.env.AccountName;
        this.AccountKey = process.env.AccountKey;
        //nombre del contenedor en Almacenamiento de datos-> contenedores
        this.containerName = process.env.containerName;
        this.BlobService = azure.createBlobService(this.AccountName, this.AccountKey);
    }

    async Update(blobName, file, mimeType) {

        const filePath = file.path;

        console.log('MIME Type:', mimeType);
        const options = {
            contentSettings: {
                contentType: mimeType // Establecer el tipo MIME obtenido
            }
        };
        return new Promise((resolve, reject) => {
            this.BlobService.createBlockBlobFromLocalFile(this.containerName, blobName, filePath, options, (error) => {
                if (error) {
                    console.log('Error uploading file:', error);
                    //Pasa el catch externo
                    reject(error);
                } else {
                    //Si funciona seguira el codigo normalmente
                    const url = this.BlobService.getUrl(this.containerName, blobName)
                    resolve(url);
                }
            });
        });
    }
}

class Update_SupaBase extends Storage_Update {
    constructor(database) {
      super();
      this.DataBase = database;
      this.Bucket = process.env.Bucket;
    }
  
    async Update(blobName, file, mimeType) {
      const filePath = file.path;
  
      const supabase = await this.DataBase.connect();

      const fileData = fs.readFileSync(filePath);
  
      const { data, error } = await supabase
        .storage
        .from(this.Bucket)
        .update(blobName, fileData);
  
      if (error) {
        console.error('Error al actualizar el archivo:', error);
        return null;
      }
  
      const url = await supabase.storage.from(this.Bucket).getPublicUrl(blobName);
  
      return url.data.publicUrl;
    }
  }
  

class Storage_Delete {
    constructor() { }
    // Método con implementación predeterminada
    async Delete() {
        throw new Error(`Sobreescribir eliminacion de un Blob`)
    }
}

// Clase derivada de AzuraConnection
class Delete_Azura extends Storage_Delete {

    constructor() {
        super();
        //nombre de la cuenta de almacenamiento y clave(no Cadena de conexión)+
        //se consiguen en Claves de acceso
        this.AccountName = process.env.AccountName;
        this.AccountKey = process.env.AccountKey;
        //nombre del contenedor en Almacenamiento de datos-> contenedores
        this.containerName = process.env.containerName;
        this.BlobService = azure.createBlobService(this.AccountName, this.AccountKey);
    }

    // Sobrescribe el método con implementación predeterminada
    async Delete(blobName) {
        //Utilizo promise debio a que es un callback y por ende aunque se genere un error el codigo seguira
        //Se utiliza promesa para utilizar resolve y reject para controlar el flujo y el manejo de errores.
        //Al momento de un error se ejecutara el catch correspondiente 
        return new Promise((resolve, reject) => {
            this.BlobService.deleteBlobIfExists(this.containerName, blobName, (error, result) => {
                if (error) {
                    //Pasa el catch externo
                    reject(error);
                } else {
                    //Si funciona seguira el codigo normalmente
                    resolve();
                }
            });
        });
    }
}

class Delete_SupaBase extends Storage_Delete {
    constructor(database) {
        super();
        this.DataBase = database;
        this.Bucket = process.env.Bucket;
    }

    async Delete(blobName) {

        const supabase = await this.DataBase.connect();

        const { data, error } = await supabase.storage.from(this.Bucket).remove([blobName]);

        if (error) {
            console.error('Error al eliminar el archivo:', error);
        } else {
            console.log('Archivo eliminado exitosamente:', data);
        }
    }
}

//Para exportar la Clase
//module.exports = { Create_Storage: Create_SupaBase, Update_Storage: Update_SupaBase, Delete_Storage: Delete_SupaBase };

module.exports = { Create_Storage: Create_Azura, Update_Storage: Update_Azura, Delete_Storage: Delete_Azura };