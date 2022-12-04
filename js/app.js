// VARIABLES
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

// EVENT LISTENER

cargarEventListeners(); // Invocando la funcion que escucha cuando hacen un click en "lista cursos" y ejecuta la funcion agregarCurso

function cargarEventListeners() {
    // Cuando hace click en "Agregar al carrito" se ejecuta la funcion "agregarCurso"
    listaCursos.addEventListener('click', agregarCurso)

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso)

    /* Muestra los cursos en Local Storage */
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem(carrito) ) || [];  
        carritoHtml();
    })
    /* Vaciar el carrito */
    vaciarCarritoBtn.addEventListener('click', seguro);
};

/* Comfirmar eliminacion / elimiacion de carrito */
function seguro(e){
    if(articulosCarrito.length === 0){
        alert('El carrito esta vacio. Añade tu primer curso a la cesta')
    } else if(articulosCarrito) {
       const pregunta =  confirm('Esta seguro que desea eliminar?');
       if(pregunta){
            articulosCarrito = [];
            limpiarHtml();
       } else {
            return articulosCarrito;
       }
    }
};

// FUNCIONES

/* Evaluando si en las clases del elemento obtenido por el target del evento click existe una clase 'agregar carrito'.  
   Si exsite > Crea una variable llamada cursoSeleccionada y almacena el elemento padre del elemento padre de dicho elento
   y tambien invoca la funcion "leerDatosCurso" con el argumento "cursoSeleccionado" >> LEER FUNCION "leerDatosCurso"*/
function agregarCurso(e) { // e Es el evento
    e.preventDefault(); // Previene el comportamiento por default del evento
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement
        leerDatosCurso(cursoSeleccionado)
    }
};

/* Elimina un curso del carrito */
function eliminarCurso(e){
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');
        /* Eliminamos un item del arreglo por medio del data-id con el metodo .filter */
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );
        /* Iterar sobre el carrito nuevamente y traer su html */
        carritoHtml();
    }
    
};

/* 1 - leerDatosCurso toma el en su paramatro la const "cursoSeleccionado" que contiene el elemento que obtuvimos.
   2 - ademas crea una Funcion leerDatosCurso y crea una objeto con los elementos html capturados desde el parametro.
   3 - */
function leerDatosCurso(curso) { // en el parametro curso se alojara el elemento html al cual se hizo el evento click
    const infoCurso = { // Construccion de objeto
        imagen: curso.querySelector('img').src, //Captura el atributo src del elemento img
        titulo: curso.querySelector('h4').textContent,  // Captura el texto del elemento h4
        precio: curso.querySelector('.precio span').textContent, // Captura el texto del elemento span de la clase .precio
        id: curso.querySelector('a').getAttribute('data-id'), // Captura del elemento a el atributo data-id
        cantidad: 1,    // Capturara la cantidad de veces que el usuario haga click en el elemento

    }
    /* Revisa si un elemento ya existe en el carrito */
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if(existe){
        /* Actualizamos la cantidad */
        const cursos = articulosCarrito.map(curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso; // Retorna el curso actualizado
            } else {
                return curso; // Retorna los cursos originales
            }
        })
        articulosCarrito = [...cursos];
    } else {
        /* Agregamos el curso al carrito */
        articulosCarrito = [...articulosCarrito, infoCurso]; // La variable "articulosCarrito" es un array y por medio de un spread operator alojara en si misma "articulosCarrito" y el objeto "infoCurso"

    }

    carritoHtml();
}

/* Funcion carritoHtml itera por medio de un forEach() el array articulosCarrito[] y en cada iteracion
    */
function carritoHtml() {
    // Limpia el carrito
    limpiarHtml();

    // Itera cada indice del array "articulosCarrito"
    articulosCarrito.forEach(curso => {
        const {imagen, titulo, precio, cantidad, id} = curso; // utilizando destructuring
        // row contiene el tr creado en la iteracion
        const row = document.createElement('tr');

        // row.innerHtml añade td al elemento tr y le añade el titulo del curso
        row.innerHTML = ` 
            <td>
                <img src="${imagen}" width=150>         
            </td>             
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;

        contenedorCarrito.appendChild(row);
    });

    /* AGREGAR EL CARRITO DE COMPRAS AL STORAGE */
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
}

/* Elimina los cursos del tbody */
function limpiarHtml() {
    /* Forma lenta de limpiar
    contenedorCarrito.innerHTML = ''; */

    /* Forma rapida de limpiar */

    while (contenedorCarrito.firstChild) { // mientras contenedorCarrito tenga un hijo...
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)// remover el hijo
    }
}