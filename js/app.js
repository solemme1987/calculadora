const botones = document.querySelectorAll('.btn');
const switchs = document.querySelector('.switchs');
const dark = document.getElementById('darkmode');
const fondoGrid = document.querySelector('.grid-container');


// ESTA FUNCION ME CAMBIA A MODO OBSCURO LA CALCULADORA
dark.addEventListener('click', () => {


    botones.forEach(boton => {
        if (dark.checked) {
            boton.classList.remove('ligth');
            boton.classList.add('dark');

            fondoGrid.classList.remove('ligth');
            fondoGrid.classList.add('dark');

            switchs.classList.remove('ligth');
            switchs.classList.add('dark');

        } else {
            boton.classList.remove('dark');
            boton.classList.add('ligth');

            fondoGrid.classList.remove('dark');
            fondoGrid.classList.add('ligth');

            switchs.classList.remove('dark');
            switchs.classList.add('ligth');
        }

    });




})