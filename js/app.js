// esta para los efectos de los botones en dark mode o ligth mode
const botones = document.querySelectorAll('.btn');
const switchs = document.querySelector('.switchs');
const dark = document.getElementById('darkmode');
const calculadora = document.querySelector('#calculadora');
let campoDatos = document.querySelector('#datos');
let resultado = document.querySelector('#resultado');
let borrarDato = document.querySelector('#borrar');


cargarEventListeners();
campoDatos.addEventListener('keydown', capturarTeclas);

function cargarEventListeners() {
    calculadora.addEventListener('click', capturarNumerosDeCalculadora);
    campoDatos.addEventListener('keydown', capturarTeclas);
    borrarDato.addEventListener('mousedown', retroceso);
}

function capturarNumerosDeCalculadora(e) {

    // CAPTURO SOLO LOS DATOS SOLO SI ES UN NUMERO
    if (e.target.classList.contains('btn')) {

        let dato = campoDatos.value;
        let opera = ['x', '-', '+', '÷', '%', '.'];
        let operaEspecial = ['=', '+/-', '÷', '( )'];

        // Si la letra es diferente de c y a = que  
        // agregue el valor del boton
        if (e.target.innerHTML != 'c' && e.target.innerHTML != '=') {
            campoDatos.value += e.target.innerHTML;
        }
        // Si la letra es igual a c 
        // que borre todo lo de la calculadora
        if (e.target.innerHTML == 'c') {
            campoDatos.value = '';
        }
        //  si el campo está vacio y estoy enviando el botón 
        //  de una operación, pues que  no me agregue ninguna 
        //  dato al campo de texto siempre y cuano no halla
        // algun numero  escrito primeramente
        if (e.target.classList.contains('opera') && dato == '') {
            campoDatos.value = '';
        }

        // ESTE IF ME CONTROLA QUE NO SE COLOQUEN 2 SIGNOS DE OPERACION UNO AL LADO DE OTRO
        if (opera.indexOf(dato.slice(-1)) >= 0 && e.target.classList.contains('opera')) {

            //no se permite un signo de operacion y luego un signo de % porcentaje 
            // esa operacion da error
            if (dato.slice(-1) != '%' && e.target.innerHTML == '%') {
                console.log('operacion no valida');
                let nuevo = campoDatos.value.slice(0, -1);
                campoDatos.value = nuevo;
                return false;
            } else { //si agregamos una operacion seguida  de otra operacion ej:*+
                //  elimino los 2 signos y dejo solo el ultimo que ingresé

                let operacion = e.target.innerHTML;

                let nuevo = campoDatos.value.slice(0, -2).concat(operacion);

                campoDatos.value = nuevo;
            }
        }

    }

}

function capturarTeclas(e) {

    console.log(`"${e.key}": ${e.keyCode}`);

    let numeros = "0123456789";
    let teclasOperaciones = [8, ];
    let teclas = e.key;

    if (numeros.indexOf(teclas) == -1 && e.keyCode != 8) {
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

        } else {
            boton.classList.remove('dark');
            boton.classList.add('ligth');

            calculadora.classList.remove('dark');
            calculadora.classList.add('ligth');

            switchs.classList.remove('dark');
            switchs.classList.add('ligth');
        }
    });
});