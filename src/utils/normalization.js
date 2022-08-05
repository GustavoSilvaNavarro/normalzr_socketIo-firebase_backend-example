import { normalize, schema } from 'normalizr';
import util from 'util';

export const normalizedData = dataArr => {
    //SCHEMAS
    const authorSchema = new schema.Entity("author", {}, { idAttribute: "email" });
    const mensajeSchema = new schema.Entity("mensaje", { author: authorSchema }, { idAttribute: "id" });
    const schemaMensajes = new schema.Entity("mensajes", {mensajes: [mensajeSchema]}, {idAttribute: "id" });

    const normalizedChats = normalize({ id: "mensajes", mensajes: dataArr }, schemaMensajes);

    return normalizedChats;
};

export const compressionPercentage = (data, dataOriginal) => {
    const normalizado = JSON.stringify(data).length;
    const normal = JSON.stringify(dataOriginal).length;
    return (normalizado/normal) * 100;
};

//ALLOW ME TO SEE OBJECT NESTED OTHER OBJECTS AND ARRAY
export function print(obj) {
    console.log(util.inspect(obj, false, 12, true));
};