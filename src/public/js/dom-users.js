const socket = io('/');

//SCHEMAS
const authorSchema = new normalizr.schema.Entity("author", {}, { idAttribute: "email" });
const mensajeSchema = new normalizr.schema.Entity("mensaje", { author: authorSchema }, { idAttribute: "id" });
const schemaMensajes = new normalizr.schema.Entity("mensajes", {mensajes: [mensajeSchema]}, {idAttribute: "id" });

//Global variables
const userFormInfo = document.querySelector('#submitFormInfo');
const formBtn = document.getElementById('btnFormUser');
const nombreUser = document.querySelector('#floatingInputNameUser');
const emailUser = document.querySelector('#floatingInputEmail');
const userInteraction = document.querySelector('#userInteraction');
const userForm = document.querySelector('#userForm');
const userName = document.getElementById('userName');
const apellidoUser = document.querySelector('#floatingInputApellido');
const edadUser = document.querySelector('#floatingInputEdad');
const aliasUser = document.querySelector('#floatingInputAlias');
const avatarUser = document.querySelector('#floatingInputAvatar');

//Producto
const productForm = document.querySelector('#productForm');
const productsBtn = document.getElementById('productsBtn');
const productoName = document.getElementById('floatingInputName');
const productoStock = document.getElementById('floatingInputStock');
const productoPrice = document.getElementById('floatingInputPrice');
const productoUrl = document.getElementById('floatingInputUrl');
const table = document.getElementById('tableproductData');

//CHATS
const chatForm = document.querySelector('#chatForm');
const messages = document.querySelector('#userMessage');
const btnChatSubmit = document.querySelector('#submitBtnMessage');
const chatContainer = document.querySelector('#chatContainer');

let usuario;

//SUBMIT INFO
formBtn.onclick = e => {
    e.preventDefault();

    let user = { nombre: nombreUser.value, id: emailUser.value, apellido: apellidoUser.value, edad: edadUser.value, alias: aliasUser.value, avatar: avatarUser.value };

    socket.emit('userInfo', user);
    userFormInfo.reset();
};

socket.on('usuario', async data => {
    usuario = data;
    console.log(usuario);

    if(usuario) {
        userForm.classList = 'userInfoRemove';
        userName.textContent = usuario.nombre;
        userInteraction.classList.remove('productInfoRemoved');
    };
});

// Products form
productsBtn.onclick = e => {
    e.preventDefault();

    let product = { name: productoName.value, price: productoPrice.value, url: productoUrl.value, stock: productoStock.value };
    productForm.reset();

    socket.emit('product', product);
};

socket.on('allProducts', newInfo => {
    document.getElementById('warningProducts').classList = 'emptyListProducts';
    document.getElementById('productsTable').classList.remove('emptyListProducts');

    const html = `
        {{#each newInfo}}
            <tr>
                <th scope="row" class="text-center">{{ name }}</th>
                <td class="text-center">$ {{ price }}</td>
                <td class="text-center">{{ stock }}</td>
                <td class="text-center">
                    <img height="75px" width="120px" src={{ url }} alt={{ name }} />
                </td>
            </tr>
        {{/each}}
    `;
    
    const template = Handlebars.compile(html);
    const data = template({newInfo});

    table.innerHTML = data;
});

//SUBMIT MESSAGE
btnChatSubmit.onclick = e => {
    e.preventDefault();

    //Get object
    const date = new Date(Date.now()).toLocaleString().replace(',', '');
    const fecha = `[${date}]`

    const mensaje = {
        author: {
            email: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            edad: Number(usuario.edad),
            alias: usuario.alias,
            avatar: usuario.avatar
        },
        date: fecha,
        message: messages.value
    };

    socket.emit('client:newMessage', mensaje);
    chatForm.reset();
};

socket.on('server:messages', mess => {
    const denormalizedData = normalizr.denormalize(mess.oldDataNormalized.result, schemaMensajes, mess.oldDataNormalized.entities);
    if(denormalizedData) {
        const chats = denormalizedData.mensajes;

        const templateMess = `
            {{#each chats}}
                <p><span class="fw-bold text-primary">{{ author.email }}</span> <span class="fw-normal brown">{{ date }}: </span><span class="fst-italic text-success">{{ message }}</span></p>
            {{/each}}
        `;

        const template = Handlebars.compile(templateMess);
        const newMessages = template({chats});

        document.getElementById("compressionNormalized").textContent = mess.porcentaje;

        chatContainer.innerHTML = newMessages;
    };
});