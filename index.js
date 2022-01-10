
class Producto{
    constructor(id, descripcion, marca, precio, imagen, caracteristicas){
        this.id = id;
        this.descripcion = descripcion;
        this.marca = marca;
        this.precio = precio;
        this.imagen = imagen;
        this.caracteristicas = caracteristicas;
    }

    sumarIva(){
        this.precio = (this.precio * 1.21).toFixed(2);
    }
}

class Resumen{
    constructor(monto, montoConInteres, valorCuota, cuotas, interes){
        this.monto = monto;
        this.montoConInteres = montoConInteres;
        this.valorCuota = valorCuota;
        this.interes = interes;
        this.cuotas = cuotas;
    }
}

const productos = [];
let cantidadCuotas = 1;
let totalAPagar = 0;
let productosSeleccionados = [];


/**Definición de funciones */
function definirCantidadCuotas(){
    return parseInt(prompt("Ingrese la cantidad de cuotas (1, 3, 6 o 12)"));
}

function obtenerSumaDeLosPrecios(arrayProductos){
    let total = 0;
    
    for (let item of arrayProductos) {
        //item.sumarIva();
        total += Number(item.precio);
    }
    
    return total.toFixed(2);
}

function calcularValorCuota(valor, cuotas){

    if( cuotas == 1){
        montoConInteres = valor * 1;
        valorCuota = montoConInteres / cuotas;
        interes = "sin interés";
    }else if( cuotas == 3){
        montoConInteres = valor * 1.15;
        valorCuota = montoConInteres / cuotas;
        interes = "15%";
    }else if( cuotas == 6){
        montoConInteres = valor * 1.30;
        valorCuota = montoConInteres / cuotas;
        interes = "30%";
    }else if( cuotas == 12){
        montoConInteres = valor * 1.45;
        valorCuota = montoConInteres / cuotas;
        interes = "45%";
    }else{
        //Ya no pasa más por aquí porque los opciones están definidas en el select
        return mostrarMensaje('No se pudo calcular el valor de la cuota. Ingrese 1, 3, 6 o 12 cuotas.');
    }

    const resumen = new Resumen(valor, montoConInteres, Number(valorCuota.toFixed(2)), cuotas, interes);

    return resumen;
}

function mostrarMensaje(mensaje){
    document.getElementById("resultado").innerHTML = mensaje;
}

/** */


const producto1 = new Producto("1", "Notebook", "Acer", 100000, 'notebook.jpg', {memoria: "8GB", pantalla: "15\"", procesador: "Intel Core i7", bateria: "Polímero de litio."});
const producto2 = new Producto("2", "Smart Tv", "Samsung", 80000, 'smartv.jpg', {sistema: "Android TV", pantalla: "42\"", resolucion: "3840x2160"});
const producto3 = new Producto("3", "Celular", "Motorola", 64000, 'celular.jpg', {memoria: "6GB", pantalla: "6\"", almacenamiento: "128GB", peso: "225g"});
const producto4 = new Producto("4", "Lavarropas", "Drean", 94999, 'lavarropas.jpg', {capacidad: "10Kg", eficiencia: "A+++", conexion: "WiFi"});
const producto5 = new Producto("5", "Aire Acondicionado", "Philco", 51999, 'aireacondicionado.jpg', {tipo: "Frio/Calor", frigorias: "2600"});
const producto6 = new Producto("6", "Cocina", "Whirlpool", 127259, 'cocina.png', {tipo: "Gas", eficiencia: "A"});

productos.push(producto1);
productos.push(producto2);
productos.push(producto3);
productos.push(producto4);
productos.push(producto5);
productos.push(producto6);

/**agrego listener a boton calcular cuotas */
let btnCalcularCuotas = document.getElementById("calcularCuotas");
btnCalcularCuotas.addEventListener("click", callbackCalcularCuotas);

/**Calback del click en el botón de calculo de cuotas */
function callbackCalcularCuotas(){

    let productosSeleccionados = recuperarProductos();
    
    if(productosSeleccionados.length > 0){

        select = document.getElementById("selectCuotas");
        cantidadCuotas = select.value;
        totalAPagar = obtenerSumaDeLosPrecios(productosSeleccionados);
        miResumen = calcularValorCuota(totalAPagar, cantidadCuotas);
    
        mostrarMensaje(
            `<div>Se cobrará $${miResumen.monto} en ${miResumen.cuotas} cuota(s) de: $${miResumen.valorCuota}</div>
            <div>Interés aplicado: ${miResumen.interes}</div>`
        );

    }
    else{
        mostrarMensaje("No seleccionó ningún producto!");
    }
}

/**agrego listener a boton borrar carrito */
let btnBorrarCarrito = document.getElementById("borrarCarrito");
btnBorrarCarrito.addEventListener("click", limpiarCarrito);

/**
 * Funciones para el manejo de los productos
 * en el localstorage
 */

function agregarAlCarrito(producto){
    
    let storage = [];

    if(!localStorage.getItem("productos")){
        storage.push(producto);
        localStorage.setItem("productos", JSON.stringify(storage));
    }else{
        storage = JSON.parse(localStorage.getItem("productos"));
        storage.push(producto);
        localStorage.setItem("productos", JSON.stringify(storage));
    }

}

function recuperarProductos(){

    let storage = JSON.parse(localStorage.getItem("productos"));
    return (storage) ? storage : [];

}

function mostrarProductosDelCarrito(){

    storage = recuperarProductos();
    let resumen = document.getElementById("resumen-producto");
    resumen.innerHTML = ``;

    if(storage.length > 0 ){    
        for (const producto of storage) {
        resumen.innerHTML += `<div class="resumen-producto-item"><p>${producto.descripcion}</p><span class="badge">$${producto.precio}</span></div>`;
        }
    }
}

function limpiarCarrito(){
    localStorage.removeItem("productos");
    mostrarProductosDelCarrito();
    mostrarMensaje(`<div>Carrito eliminado con éxito!</div>`);
}


/**
 * Cuando carga la página
 * muestro los productos del storage
 */
mostrarProductosDelCarrito();


 $(document).ready(function(){
    
    //agrego banner de ofertas

    const ofertaImg = `<img src="img/ofertas.jpg"/>`;
    $("#contenedor-publicidad").prepend(ofertaImg);

    //Agrego lo productos del array como tarjetas en el html 
    //Esta vez con jQuery
    
    let milisegundos = 1000;

    for (const p of productos) {
        
        p.sumarIva();
        
        const card = $(`
        <div class="card">
            <div class="card-header">
                <img class="card-img" src="img/${p.imagen}"/>
            </div>
            <div class="card-body">
                <div class="card-precio mb-15">$ ${p.precio}</div>
                <div class="txt-secundario mb-15">${p.descripcion}</div>
                <div class="card-boton-wrapper">
                    <button class="btn-ver-info card-boton card-boton-secundario" dataId="${p.id}">Info</button>
                    <button class="btn-producto card-boton card-boton-principal" dataId="${p.id}">Seleccionar</button>
                </div>
            </div>
        </div>`).hide().fadeIn(milisegundos);

        $("#contenedor-central").append(card);
        
        milisegundos += 1000;

    }

    

    //reemplazo el addEventListener y la funcion de callback

    $(".btn-producto").on("click", function(e){
        /**a partir de los datos del evento defino el valor del id del producto seleccionado */
        idProducto = e.target.attributes.dataId.nodeValue;
        seleccionado = productos.find( el => el.id == idProducto);

        console.log(productosSeleccionados);
        p = productosSeleccionados.find( e => e.id == seleccionado.id);
        console.log("seleccionado",seleccionado);
        console.log("find",p);
        
        if(!p){
            console.log("no está");
            productosSeleccionados.push(seleccionado);
            agregarAlCarrito(seleccionado);
            mostrarProductosDelCarrito();
        }

        
    });


    /**
     * Quizás se pueda hacer lo mismo con el toggle,
     * pero no quería ocultar el popup de la información
     * sino eliminarlo
     */
    //agrego funcionalidad a boton INFO
    $(".btn-ver-info").on("click", function(e){

        //elimino el div .info cada vez que hago click
        $(this).parent().siblings(".info").remove();

        idProducto = e.target.attributes.dataId.nodeValue;
        seleccionado = productos.find( el => el.id == idProducto);

        let items = ``;

        for (const key in seleccionado.caracteristicas) {
           items += `<p>${key}: ${seleccionado.caracteristicas[key]}</p>`;
        }

        //const info = `<div class="info"><div class="close">x</div>${ items }</div>`;
        const info = `<div class="info"><span class="close material-icons">cancel</span>${ items }</div>`;

        //lo agrego al nivel del card-boton-wrapper
        $(this).parent().after(info);
        
        //animo unicamente el .info hermano del padre del botón apretado
        $(this).parent().siblings(".info").animate({
            marginTop: '+=25px',
            opacity:1
        }, 
        500);

    });

    //agrego funcionalidad a boton close del info
    $(document).on("click", ".close", function(){
        const info = $(this).parent();
        //animo la eliminación del .info
        info.fadeOut("slow", (e) => { info.remove() });
    });


    //agrego datos al menú, cómo si un usuario estuviese logueado

    $.ajax({
        method: "GET",
        url:  "https://jsonplaceholder.typicode.com/users/1",
        beforeSend: function(){
            $(".ddmenu").append(`cargando...`);
        },
        success: function(resp){
            $(".ddmenu").text('');
            $(".ddmenu").append(`
                <p><span class="material-icons">person</span>${resp.username} </p>
                <p><span class="material-icons">recent_actors</span>${resp.name}</p>
                <p><span class="material-icons">email</span>${resp.email}</p><hr>
                <p><span class="material-icons">place</span>${resp.address.city}</p>
            `)
        }
    });


    $("#perfil").on("click", function(){
        $(".ddmenu").toggle();
    });
});