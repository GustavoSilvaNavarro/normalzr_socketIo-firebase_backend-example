import { Chats, Products } from '../db/dbFBS.js';
import { normalizedData, compressionPercentage } from '../utils/normalization.js'

let chatsArr = [];
let productsArr = [];

//WEB SOCKETS EVENTS
export const socketsEvents = io => {
    io.on('connection', async socket => {
        console.log('New Connection!!!', socket.id);

        try {
            const oldMessData = await Chats.get();
            const oldProducts = await Products.get();

            oldMessData.forEach(chat => chatsArr.push({ id: chat.id, ...chat.data() }));
            oldProducts.forEach(product => productsArr.push({ id: product.id, ...product.data() }));

            if(chatsArr.length > 0) {
                const oldDataNormalized = normalizedData(chatsArr);
                const porcentaje = compressionPercentage(oldDataNormalized, chatsArr);
                const resp = { oldDataNormalized, porcentaje};

                io.emit('server:messages', resp);
            };

            if(chatsArr.length > 0) {
                io.emit('allProducts', productsArr);
            };
        } catch (err) {
            console.log(err.message);
        };

        socket.on('userInfo', user => {
            socket.emit('usuario', user);  
        });

        socket.on('product', async product => {
            try {
                const newProduct = await Products.add(product);
                productsArr.push({ id: newProduct.id, ...product});

                io.emit('allProducts', productsArr);
            } catch (err) {
                const error = new Error(err.message);
                return error;
            };
        });

        socket.on('client:newMessage', async mess => {
            try {
                const newMess = await Chats.add(mess);
                chatsArr.push({ id: newMess.id, ...mess});

                const oldDataNormalized = normalizedData(chatsArr);
                const porcentaje = compressionPercentage(oldDataNormalized, chatsArr);
                const resp = { oldDataNormalized, porcentaje};

                io.emit('server:messages', resp);
            } catch (err) {
                const error = new Error(err.message);
                return error;
            };
        });
    });
};