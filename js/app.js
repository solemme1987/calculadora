// esta para los efectos de los botones en dark mode o ligth mode
const botones = document.querySelectorAll('.btn');
const switchs = document.querySelector('.switchs');
const dark = document.getElementById('darkmode');

const btnHistorial = document.getElementById('btn_historial');
const listaHistorial = document.getElementById('lista_historial');
const panelHistorial = document.getElementById('panel_historial');


const borrarHistorial = document.getElementById('box_borrar_historial');
const btnEliminarHistorial = document.getElementById('eliminarHistorial');

const error = document.getElementById('error');
const calculadora = document.querySelector('#calculadora');

let campoDatos = document.querySelector('#datos');
let borrarDato = document.querySelector('#borrar');
let resultado = document.querySelector('#resultado');


let numeros = "0123456789";
let teclasValidas = [8, 37, 39, 56, 57];

let opera = ['x', '-', '+', '÷', '%', '.'];
let operaEspecial = ['+/-', '÷', '()'];
let aperturaParen = 0;
let cierreParen = 0;
let cantidadDecimal = 0;

let historialOperaciones = [];


cargarEventListeners();
campoDatos.addEventListener('keydown', capturarTeclas);

function cargarEventListeners() {
    calculadora.addEventListener('click', capturarBotonesCalculadora);
    campoDatos.addEventListener('keydown', capturarTeclas);
    borrarDato.addEventListener('mousedown', retroceso);
    btnHistorial.addEventListener('click', mostrarHistorial);

    // si hay  datos en el local storage  los agrego al arreglo de historial 
    //  si no ha datos le paso un arreglo vacio
    document.addEventListener('DOMContentLoaded', () => {

        historialOperaciones = JSON.parse(localStorage.getItem('historial')) || [];

    });

    btnEliminarHistorial.addEventListener('click', eliminarHistorial);

}

function capturarBotonesCalculadora(e) {

    // CAPTURO SOLO LOS DATOS SOLO SI ES UN BOTON
    if (e.target.classList.contains('btn')) {

        let dato = campoDatos.value;

        // Si la letra es diferente de c y a = que  
        // agregue el valor del boton al campo de texto
        if (e.target.innerHTML != 'c' && e.target.innerHTML != '=') {
            campoDatos.value += e.target.innerHTML;
        }

        // Si la letra es igual a "c" (clear)
        // que borre todo lo de la calculadora
        // y me deje en ceros los contadores de parentesis
        if (e.target.innerHTML == 'c') {
            aperturaParen = 0;
            cierreParen = 0;
            campoDatos.value = '';
            resultado.innerHTML = '0';
        }

        //  si el campo está vacio y estoy enviando el botón 
        //  de una operación, pues que  no me agregue ninguna 
        //  dato al campo de texto siempre y cuano no halla
        // algun numero  escrito primeramente
        // solo permite los parentesis
        if (e.target.classList.contains('opera') && dato == '' && e.target.innerHTML != '()') {
            campoDatos.value = '';
        }

        // ESTE IF ME CONTROLA QUE NO SE COLOQUEN 2 SIGNOS DE OPERACION UNO AL LADO DE OTRO
        if (opera.indexOf(dato.slice(-1)) >= 0 && e.target.classList.contains('opera')) {

            //no se permite un signo de operacion y luego un signo de % porcentaje 
            // esa operacion da error
            if (dato.slice(-1) != '%' && e.target.innerHTML == '%') {

                let nuevo = campoDatos.value.slice(0, -1);
                campoDatos.value = nuevo;
                mostrarError();
            } else { //si agregamos una operacion seguida  de otra operacion ej:*+
                //  elimino los 2 signos y dejo solo el ultimo que ingresé

                let operacion = e.target.innerHTML;

                let nuevo = campoDatos.value.slice(0, -2).concat(operacion);

                campoDatos.value = nuevo;
                if (dato.slice(-1) == '(' && e.target.innerHTML == '%') {
                    console.log('operacion no valida');
                    let nuevo = campoDatos.value.slice(0, -1);
                    campoDatos.value = nuevo;
                    return false;
                }
            }


        }

        /*VALIDANDO QUE NO HALLA UN %,x,÷ DESPUES DE UN PARENTESIS ABIERTO
        ESTAS OPERACINES NO ESTÁN PERMITIDAS COLOCARSE JUSTO DESPUES DE LA
        APERTURA DE UN PARENTESIS */

        if (campoDatos.value.length > 0) {

            let noPermitidas = ['%', 'x', '÷'];

            if (campoDatos.value[campoDatos.value.length - 2] == '(' && noPermitidas.indexOf(e.target.innerHTML) >= 0) {

                campoDatos.value = campoDatos.value.slice(0, -1);
                console.log('Operación no valida ');
                mostrarError();

            }

            // VALIDACION DEL PUNTO EN EL PARENTESIS
            if (campoDatos.value.slice(0, -1) == '(' && e.target.innerHTML == '.') {
                campoDatos.value = campoDatos.value.slice(0, -1).concat('0.');
                console.log(campoDatos.value);
            }
            if (campoDatos.value.slice(-3, 0) == '(0.') {
                console.log(campoDatos.value.slice(-3, 0));
                console.log(e.target);
                if (e.target.classList.contains('numero')) {
                    console.log('esta ingresando numeros despues de un punto');
                }
            }

        }

        // VALIDACION DEL PUNTO 
        if (campoDatos.value.length == 0 && e.target.innerHTML == '.') {
            campoDatos.value = campoDatos.value.slice(0, -1).concat('0.');
            console.log(campoDatos.value);
        }

        // VALIDACION DE DE LA CAPTURA DEL PARENTESIS
        if (e.target.classList.contains('parentesis')) {


            campoDatos.value = campoDatos.value.slice(0, -2);

            if (campoDatos.value == '' || campoDatos.value.slice(-1) == '(' || cierreParen >= aperturaParen) {

                aperturaParen++;
                campoDatos.value += '(';

            } else if (numeros.indexOf(campoDatos.value.slice(-1) >= 0)) {
                cierreParen++;
                campoDatos.value += ')';
            }

            if (cierreParen == aperturaParen) {

                aperturaParen = 0;
                cierreParen = 0;
                campoDatos.value += 'x';

            }


        }

    }

    //ESTE IF LO HAGO DE PRUEBA PARA TRABAJAR LAS OPERACIONES
    //AL FINAL DEBO DECIDIR SI LO DEJO O NO
    if (e.target.innerHTML == '=') {
        calcular();
    }
}

// CAPTURO LAS TECLAS VALIDS DESDE EL TECLADO
function capturarTeclas(e) {

    console.log(`"${e.key}": ${e.keyCode}`);
    let teclas = e.key;

    if (numeros.indexOf(teclas) == -1 && teclasValidas.indexOf(e.keyCode) == -1) {
        e.preventDefault();
        return false;
    }

}

// BORRAR EL ULTIMO CARACTER INGRESADO CON EL BOTON 
// BORRAR O RETROCESO DE LA CALCULADORA
function retroceso(e) {


    let tamano = campoDatos.value.length;
    let borrado = campoDatos.value.slice(0, tamano - 1);
    campoDatos.value = borrado;

    /**VALIDAMOS QUE CUANDO BORREMOS CON EL BOTON RETROCESO DE LA 
     * CALCULADORA  LA CANTIDAD DE PARENTESIS  SE VAYA SUMANDO O RESTANDO PARA QUE 
     * SIGA EL FLUJO NORMAL DE LA ESCRITURA DE PARENTESIS*/
    let listOpenParent = [];
    let listCloseParent = [];

    for (let i = 0; i < campoDatos.value.length; i++) {

        if (campoDatos.value[i] == "(") {
            listOpenParent.push(i);
        } else if (campoDatos.value[i] == ")") {
            listCloseParent.push(i);
        }

    }
    aperturaParen = listOpenParent.length;
    cierreParen = listCloseParent.length;
    /**----------------------------------------------------------
     *       CIERRE DE VALIDACION DE PARENTESIS 
     * ---------------------------------------------------------*/
}


// calcular operaciones
function calcular() {

    let operaHisto = campoDatos.value;
    let resulHisto;

    let operacion = campoDatos.value.replace(/x/g, '*');
    let respuesta;

    // Convierto la operacion en un formato valido
    // reemplazando los caracteres de multiplicacion y 
    // division por los correctos
    operacion = operacion.replace(/÷/g, '/');
    respuesta = eval(operacion);

    if (respuesta.toString().indexOf('.') == -1) {
        resultado.innerHTML = respuesta;
        resulHisto = respuesta;
    } else {
        resultado.innerHTML = (respuesta.toString().substr(0, 4));
        resulHisto = (respuesta.toString().substr(0, 4));
    }


    campoDatos.value = resulHisto;
    guardarHistorial(operaHisto, resulHisto);
}

// Guarda el historial
function guardarHistorial(operaHisto, resulHisto) {

    const historial = {
        operacion: operaHisto,
        resultado: resulHisto
    };

    historialOperaciones = [...historialOperaciones, historial];
    localStorage.setItem('historial', JSON.stringify(historialOperaciones));
}

// Muestra el panel del historial
function mostrarHistorial() {

    listaHistorial.classList.toggle('verHistorial');
    borrarHistorial.classList.toggle('scroll');
    panelHistorial.classList.toggle('mostrar');



    if (historialOperaciones.length > 0) {

        listaHistorial.innerHTML = '';
        historialOperaciones.forEach(element => {
            listaHistorial.innerHTML += `
        
        <li>
            <p class="historial_item_operacion pOperacion">${element.operacion}</p>
            <p class="historial_item_resultado pResultado">${element.resultado}</p>
        </li>
        `;
        });
    }


}

// Eliminar historial
function eliminarHistorial() {
    console.log(historialOperaciones.length);
    if (historialOperaciones.length > 0) {

        localStorage.removeItem('historial');
        listaHistorial.innerHTML = `
        <div class="historialVacio">
            <p><i class="fas fa-box-open"></i></p>
            <p class="vacioText">No Hay Historial</p>
        </div>
        `;
        historialOperaciones = [];
    }

}


// Muestra error de operacion
function mostrarError() {

    error.classList.toggle('visible');
    setTimeout(() => {
        error.classList.toggle('visible');
    }, 1000);
    return false;
}

// ESTA FUNCION ME CAMBIA A MODO OBSCURO LA CALCULADORA
dark.addEventListener('click', () => {
    botones.forEach(boton => {
        if (dark.checked) {
            boton.classList.remove('ligth');
            boton.classList.add('dark');

            calculadora.classList.remove('ligth');
            calculadora.classList.add('dark');

            switchs.classList.remove('ligth');
            switchs.classList.add('dark');


            panelHistorial.classList.remove('ligth');
            panelHistorial.classList.add('dark');


        } else {
            boton.classList.remove('dark');
            boton.classList.add('ligth');

            calculadora.classList.remove('dark');
            calculadora.classList.add('ligth');

            switchs.classList.remove('dark');
            switchs.classList.add('ligth');

            panelHistorial.classList.remove('dark');
            panelHistorial.classList.add('ligth');
        }
    });
});