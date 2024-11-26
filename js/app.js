//Campos del formulario
let DB;
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//Contenedor para las citas
const contenedorCitas = document.querySelector('#citas');

//Formulario nuevas citas
const formulario = document.querySelector('#nueva-cita');
formulario.addEventListener('submit', nuevaCita);


//Heading
const heading = document.querySelector('#administra');

let editando; 

window.onload = () => {
    eventListener();

    crearDB();
}

//Registrar eventos

function eventListener() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

}

//Objeto con la información de la cita
const citaObj  = {
    mascota: '' ,
    propietario: '' ,
    telefono: '' ,
    fecha: '' ,
    hora: '' ,
    sintomas: '' ,
}

//Agrega datos al objeto de cita
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}


class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];

        console.log(this.citas);
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita );
    }
}
 

class UI {
    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase en base al tipo de error
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
     
        //Quitar la alerta
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }

    imprimirCitas( ) {  //Se puede aplicar destructuring desde la función

        this.limpiarHTML();

        this.textoHeading(citas);
        
        //Leer el contenido en la base de datos
        const objectStore = DB.transaction('citas').objectStore('citas');
        
        const fnTextoHeading = this.textoHeading;

        const total = objectStore.count();
        total.onsuccess = function() {
            fnTextoHeading(total.result);
        }

        objectStore.openCursor().onsuccess = function(e) { //openCursor recorre e imprime los datos de la BD, similar a un forEach 
            
            const cursor = e.target.result;

            if(cursor) {

                const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;
                

                const divCita = document.createElement('DIV');
                divCita.classList.add('cita', 'p-3');
                divCita.dataset.id = id;

                //Scripting de los elementos de la cita
                const mascotaParrafo = document.createElement('H2');
                mascotaParrafo.classList.add('card-tittle', 'font-weight-bolder');
                mascotaParrafo.textContent = mascota;

                const propietarioParrafo = document.createElement('P');
                propietarioParrafo.innerHTML = `
                    <span class"font-weight-bolder">Propietario: </span> ${propietario}
                `;

                const telefonoParrafo = document.createElement('P');
                telefonoParrafo.innerHTML = `
                    <span class"font-weight-bolder">Teléfono: </span> ${telefono}
                `;

                const fechaParrafo = document.createElement('P');
                fechaParrafo.innerHTML = `
                    <span class"font-weight-bolder">Fecha: </span> ${fecha}
                `;       
                
                const horaParrafo = document.createElement('P');
                horaParrafo.innerHTML = `
                    <span class"font-weight-bolder">Hora: </span> ${hora}
                `; 

                const sintomasParrafo = document.createElement('P');
                sintomasParrafo.innerHTML = `
                    <span class"font-weight-bolder">Sintomas: </span> ${sintomas}
                `; 
                
                //Botón para eliminar esta cita
                const btnEliminar = document.createElement('BUTTON');
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>`
                
                btnEliminar.onclick = () => eliminarCita(id);

                //Añade un botón para editar
                const btnEditar = document.createElement('BUTTON');
                const cita = cursor.value;
                btnEditar.onclick = () => cargarEdicion(cita);

                btnEditar.classList.add('btn', 'btn-info');
                btnEditar.innerHTML = `Editar<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>`;

                
                //Agregar los parrafos al HTML (en eldivCita) 
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar);
                divCita.appendChild(btnEditar);

                //Agregar las citas al HTML
                contenedorCitas.appendChild(divCita);

                //Ve al siguiente elemento
                cursor.continue();
            }
        }
    }

    textoHeading(resultado) {
     
        if(resultado > 0) {
            heading.textContent = 'Administra tus citas'
        } else {
            heading.textContent = 'No hay citas, comienza creando una'
        }
    }

    limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const administrarCitas = new Citas();
const ui = new UI();



//Valida y agrega una nueva cita a la calse de citas
function nuevaCita(e) {
    e.preventDefault();

    //Extraer la información del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    //Validar
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return; //Para que no se ejecute la siguiente línea de código
    } 

    if(editando) {
        ui.imprimirAlerta('Editado correctamente');

        //Pasar el objeto de la cita a edición
        administrarCitas.editarCita( {...citaObj} );

        //Edita en IndexedDb
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');

        objectStore.put(citaObj); //"put" permite editar un registro

        transaction.oncomplete = () => {

        ui.imprimirAlerta('Guardado Correctamente');
        //Regresar el texto del botón a su estado original
        
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        //Quitar modo edición
        editando = false;
        }

        transaction.onerror = () => {
            console.log('Hubo un error');
        }

    } else {
        //Nuevo Registro

        //Generar un id único
        citaObj.id = Date.now();

        //Creando una nueva cita
        administrarCitas.agregarCita({...citaObj});
    
        //Instertar Registro en IndexedDB
        const transaction = DB.transaction(['citas'], 'readwrite');

        //Habilitar el objectStore
        const objectStore = transaction.objectStore('citas');

        //Insertar en la BD
        objectStore.add(citaObj);

        transaction.oncomplete = function() {
            console.log('Cita Agregada');

            //Mensaje de agregado correctamente
            ui.imprimirAlerta('Se agregó correctamente');
        }

        
    }

    //Mostrar el HTML
    ui.imprimirCitas();

    //Reiniciar el objeto para la validación
    reiniciarObjeto();
    
    //Reiniciar el formulario 
    formulario.reset();

    
}

function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id) {
    //Eliminar la cita
    const transaction = DB.transaction(['citas'], 'readwrite');
    objectStore = transaction.objectStore('citas');

    objectStore.delete(id);

    transaction.oncomplete = () => {
        console.log(`Cita${id} eliminada...`);
        ui.imprimirCitas();
    }

    transaction.onerror = () => {
        console.log('Hubo un error');
    }

    //Muestre un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');


}

//Carga los datos y el modo edición
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //Llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = mascota;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}

function crearDB() {
    //Crear la base de datos en veriosn 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    //Si hay un error
    crearDB.onerror = function () {
        console.log('Hubo un error')
    }

    //Si todo va bien
    crearDB.onsuccess = function() {
        console.log('BD Creada');   

        DB = crearDB.result;

        //Mostrar citas al cargar (Siempre y cuando Indexed DB ya este listo)
        ui.imprimirCitas();
    }

    //Definir el schema
    crearDB.onupgradeneeded =  function(e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keyPath:'id',
            autoIncrement: true
        });

        //Definir todas las columnas
        objectStore.createIndex('mascota', 'mascota', { unique: false } );
        objectStore.createIndex('propietario', 'propietario', { unique: false } );
        objectStore.createIndex('telefono', 'telefono', { unique: false } );
        objectStore.createIndex('fecha', 'fecha', { unique: false } );
        objectStore.createIndex('hora', 'hora', { unique: false } );
        objectStore.createIndex('sintomas', 'sintomas', { unique: false } );
        objectStore.createIndex('id', 'id', { unique: true } );

        

        console.log('Database creada y lista');


    }
}


