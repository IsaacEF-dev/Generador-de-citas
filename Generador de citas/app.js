/**Variables Globales */
const namePaciente = document.querySelector('#cliente');
const telefono = document.querySelector('#telefono');
const fecha = document.querySelector('#fecha');
const hora = document.querySelector('#hora');
const sintomas = document.querySelector('#sintomas');
const containerCita = document.querySelector('.agenda');
const btnEnviar = document.querySelector('#enviar');
const formulario = document.querySelector('.citas');
let citas = [];
let idcita;
let verificar = false;
/**variable validar telefono */
const expTelefono = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i;
/**variable validar correo electronico */
const expressMail = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;

ejecutarEventos();

function ejecutarEventos() {
    document.addEventListener('DOMContentLoaded', iniciarApp);
    namePaciente.addEventListener("blur", validarFormulario);
    telefono.addEventListener("blur", validarFormulario);
    fecha.addEventListener("blur", validarFormulario);
    hora.addEventListener("blur", validarFormulario);
    sintomas.addEventListener("blur", validarFormulario);

    btnEnviar.addEventListener('click', leerDatos);

    document.addEventListener("DOMContentLoaded", () => {
        citas = JSON.parse(localStorage.getItem("citas")) || [];
        crearHtmlCita();
    })

    /**Eliminar y actualizar*/
    containerCita.addEventListener('click', updateDelete);
}

/**Funciones */

function iniciarApp() {
    btnEnviar.disabled = true;
    btnEnviar.style.opacity = '.5';
    btnEnviar.style.cursor = 'not-allowed';



}

function validarFormulario(e) {
    if (e.target.textLength > 0) {
        if (e.target.type === 'tel') {
            /**validacion de un numero telefonico */
            if (!expTelefono.test(e.target.value)) {
                mostrarError(e, false);
                return;
            }
        }
        mostrarError(e, true);
    } else {
        mostrarError(e, false);
    }

    validarCampos();
}

function mostrarError(e, verificar) {
    if (verificar) {
        e.target.classList.remove('incorrect');
        e.target.classList.add('correct')
        e.target.style.borderColor = "green";
    } else {
        e.target.classList.add('incorrect')
        e.target.style.borderColor = "red";
    }
}

function validarCampos() {
    if (expTelefono.test(telefono.value) && namePaciente.value !== '' && hora.value !== '' && fecha.value !== '' && sintomas.value !== '') {
        btnEnviar.disabled = false;
        btnEnviar.style.opacity = '1';
        btnEnviar.style.cursor = 'pointer';
    }
}

function leerDatos(e) {
    e.preventDefault();
    if (verificar) {
        const dateCita = citas.map(dato => {
            if (dato.id === idcita) {
                dato.paciente = namePaciente.value;
                dato.telefono = telefono.value;
                dato.fecha = fecha.value;
                dato.hora = hora.value;
                dato.sintomas = sintomas.value;
                return dato;
            } else {
                return dato;
            }
        });
        verificar = false;
        citas = [...dateCita];
    } else {
        const cita = {
            paciente: namePaciente.value,
            telefono: telefono.value,
            fecha: fecha.value,
            hora: hora.value,
            sintomas: sintomas.value,
            id: Date.now(),
        };
        citas = [...citas, cita];
    }
    crearHtmlCita();
}

function crearHtmlCita() {
    limpiarHtml();

    if (citas.length > 0) {
        citas.forEach(cita => {
            const cardCita = document.createElement('div');
            cardCita.classList.add('cita');
            cardCita.innerHTML = `
            <div class="datos">
                            <p class="paciente">${cita.paciente}</p>
                            <div class="inf">
                                <p>${cita.telefono}</p>
                                <p>${cita.fecha}</p>
                                <p>${cita.hora}</p>
                            </div>
                            <p><span>Sintomas:</span>${cita.sintomas}</p>
                        </div>
                        <div class="CRUM">
                            <a href="#" class="editar" data-id=${cita.id}>
                                <ion-icon name="pencil-outline"></ion-icon>
                            </a>
                            <a href="#" class="eliminar" data-id=${cita.id}>
                                <ion-icon name="close-circle-outline"></ion-icon>
                            </a>
                        </div>
            `;
            containerCita.appendChild(cardCita);
        });

        formulario.reset();

        borrarChekers();
        iniciarApp();
    }
    sincronizarLocalStorage();

}

function sincronizarLocalStorage() {

    localStorage.setItem("citas", JSON.stringify(citas));
}

function updateDelete(e) {
    if (e.target.parentElement.classList.contains('eliminar')) {
        const cita = citas.filter(valor => valor.id != e.target.parentElement.getAttribute('data-id'));
        citas = cita;
        console.log(citas);
        crearHtmlCita()
    } else if (e.target.parentElement.classList.contains('editar')) {
        citas.forEach(cita => {
            if (cita.id == e.target.parentElement.getAttribute('data-id')) {
                namePaciente.value = cita.paciente;
                hora.value = cita.hora;
                fecha.value = cita.fecha;
                telefono.value = cita.telefono;
                sintomas.value = cita.sintomas;
                idcita = cita.id;
                verificar = true;
            }
        })
    }
}

function borrarChekers() {
    const correct = document.querySelectorAll(".correct");
    correct.forEach(valor => {
        valor.classList.remove('correct');
        valor.style.borderColor = "rgb(179, 178, 178)";
    })
}

function limpiarHtml() {
    while (containerCita.firstChild) {
        containerCita.removeChild(containerCita.firstChild);
    }
}