class Alumno {
    constructor(nombre, apellidos, edad, matricula) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.edad = edad;
        this.matricula = matricula;
        this.materiasInscritas = [];
        this.calificaciones = {};
        this.grupo = null;
    }

    inscribirMateria(materia) {
        if (!this.materiasInscritas.includes(materia)) {
            this.materiasInscritas.push(materia);
            this.calificaciones[materia] = null;
            console.log(`Materia ${materia} inscrita para el alumno ${this.nombre} ${this.apellidos}`);

        }
    }



    asignarCalificacion(materia, calificacion) {
        if (this.materiasInscritas.includes(materia)) {
            this.calificaciones[materia] = calificacion;
            console.log(`Asignacion de calificacion ${calificacion} en la materia ${materia} para el alumno ${this.nombre} ${this.apellidos}`);
            return true; // Indica que la asignación fue exitosa
        }
        return false; // Indica que la asignación falló
    }

    obtenerPromedio() {
        const calificaciones = Object.values(this.calificaciones).filter(c => c !== null);
        const total = calificaciones.reduce((acc, cal) => acc + cal, 0);
        return calificaciones.length ? total / calificaciones.length : 0;
    }
}

class Grupo {
    constructor(nombre) {
        this.nombre = nombre;
        this.alumnos = [];
    }

    obtenerPromedioGrupo() {
        const promedios = this.alumnos.map(a => a.obtenerPromedio());
        const total = promedios.reduce((acc, prom) => acc + prom, 0);
        return promedios.length ? total / promedios.length : 0;
    }
}

// Función para convertir objetos literales en instancias de la clase Alumno
function convertirAlumnos(alumnosJSON) {
    return alumnosJSON.map(alumnoData => {
        const alumno = new Alumno(alumnoData.nombre, alumnoData.apellidos, alumnoData.edad, alumnoData.matricula);
        alumno.materiasInscritas = alumnoData.materiasInscritas;
        alumno.calificaciones = alumnoData.calificaciones;
        alumno.grupo = alumnoData.grupo;
        return alumno;
    });
}

function convertirGrupos(gruposJSON) {
    return gruposJSON.map(grupoData => {
        const grupo = new Grupo(grupoData.nombre);
        grupo.alumnos = convertirAlumnos(grupoData.alumnos || []);// Esta es para asegurarse de que los alumnos del grupo también sean instancias de Alumno
        return grupo;
    });
}

let alumnos = convertirAlumnos(JSON.parse(localStorage.getItem('alumnos')) || []);
let grupos = convertirGrupos(JSON.parse(localStorage.getItem('grupos')) || []);

function actualizarTablaAlumnos() {
    const tableBody = document.getElementById('alumnosTable');
    tableBody.innerHTML = '';

    alumnos.forEach(alumno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${alumno.nombre} ${alumno.apellidos}</td>
            <td>${alumno.edad}</td>
            <td>${alumno.matricula}</td>
            <td>${alumno.materiasInscritas.join(', ')}</td>
            <td>${Object.entries(alumno.calificaciones).map(([materia, calif]) => `${materia}: ${calif !== null ? calif : 'N/A'}`).join(', ')}</td>
            <td>${alumno.grupo || 'No asignado'}</td>
        `;
        tableBody.appendChild(row);
    });
}

function actualizarSelectAlumnos() {
    const selectAlumno = document.getElementById('selectAlumno');
    const selectAlumnoCalif = document.getElementById('selectAlumnoCalif');
    const selectAlumnoGrupo = document.getElementById('selectAlumnoGrupo');
    [selectAlumno, selectAlumnoCalif, selectAlumnoGrupo].forEach(select => select.innerHTML = '');

    alumnos.forEach((alumno, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${alumno.nombre} ${alumno.apellidos}`;
        //Agregar el Elemento <option> a los <select>:
        //option.cloneNode(true) crea una copia profunda del elemento <option> (con todos sus atributos y contenido).
        selectAlumno.appendChild(option.cloneNode(true));
        selectAlumnoCalif.appendChild(option.cloneNode(true));
        selectAlumnoGrupo.appendChild(option.cloneNode(true));
    });
}

function actualizarSelectGrupos() {
    const selectGrupo = document.getElementById('selectGrupo');
    selectGrupo.innerHTML = '';
    grupos.forEach(grupo => {
        const option = document.createElement('option');
        option.value = grupo.nombre; //Usar el nombre del grupo como valor
        option.textContent = grupo.nombre; // Mostrar nombre de grupo
        selectGrupo.appendChild(option);
    });
}

document.getElementById('studentForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const nombre = document.getElementById('name').value;
    const apellidos = document.getElementById('surname').value;
    const edad = document.getElementById('age').value;
    const matricula = document.getElementById('matricula').value;

    // Aqui verifico si la matricula ya esta registrada
    const matriculaYaRegistrada = alumnos.some(alumno => alumno.matricula === matricula);

    if (matriculaYaRegistrada) {
        alert('Matrícula ya registrada');
        document.getElementById('name').value = '';        document.getElementById('nombreGrupo').value = '';
        document.getElementById('surname').value = '';
        document.getElementById('age').value = '';
        document.getElementById('matricula').value = ''
    } else {
        const nuevoAlumno = new Alumno(nombre, apellidos, edad, matricula);
        alumnos.push(nuevoAlumno);
        localStorage.setItem('alumnos', JSON.stringify(alumnos));
        actualizarTablaAlumnos();
        actualizarSelectAlumnos();
        this.reset();
        alert(`Alumno ${nombre} ${apellidos} agregado.`);
    }
    
});

document.getElementById('inscribirBtn').addEventListener('click', function () {
    const selectAlumno = document.getElementById('selectAlumno');
    const index = parseInt(selectAlumno.value, 10);
    const materia = document.getElementById('selectMateria').value;
    console.log(`Intentando inscribir materia ${materia} al alumno en índice ${index}`);
    console.log(`alumnos: ${JSON.stringify(alumnos)}`);
    if (!isNaN(index) && index >= 0 && index < alumnos.length) {
        const alumno = alumnos[index];
        alumno.inscribirMateria(materia);
        localStorage.setItem('alumnos', JSON.stringify(alumnos));
        actualizarTablaAlumnos();
        alert(`Materia ${materia} inscrita para ${alumno.nombre} ${alumno.apellidos}.`);
    } else {
        console.error('Índice de alumno no válido');
    }
});

document.getElementById('asignarCalifBtn').addEventListener('click', function () {
    const selectAlumnoCalif = document.getElementById('selectAlumnoCalif');
    const index = parseInt(selectAlumnoCalif.value, 10);
    const materia = document.getElementById('selectMateriaCalif').value;
    const calificacion = parseFloat(document.getElementById('inputCalificacion').value);
    console.log(`Intentando asignar calificaciion ${calificacion} a la materia ${materia} al alumno en índice ${index}`);
    console.log(`alumnos: ${JSON.stringify(alumnos)}`);
    if (!isNaN(index) && index >= 0 && index < alumnos.length) {
        const alumno = alumnos[index];
        if (alumno.asignarCalificacion(materia, calificacion)) {
            localStorage.setItem('alumnos', JSON.stringify(alumnos));            
            actualizarTablaAlumnos();
            document.getElementById('inputCalificacion').value = '';
        } else {
            alert(`Materia no asignada a alumn@ ${alumno.nombre} ${alumno.apellidos}`);
        }
    } else {
        console.error('Índice de alumno no válido');
    }
});


document.getElementById('crearGrupoBtn').addEventListener('click', function () {
    const nombreGrupo = document.getElementById('nombreGrupo').value;

    if (!grupos.some(g => g.nombre === nombreGrupo)) {
        const nuevoGrupo = new Grupo(nombreGrupo);
        grupos.push(nuevoGrupo);
        localStorage.setItem('grupos', JSON.stringify(grupos));
        actualizarSelectGrupos();
        document.getElementById('nombreGrupo').value = '';
    } else {
        alert('El grupo ya existe');
    }
});

document.getElementById('asignarGrupoBtn').addEventListener('click', function () {
    const selectAlumnoGrupo = document.getElementById('selectAlumnoGrupo');
    const index = parseInt(selectAlumnoGrupo.value, 10);
    const nombreGrupo = document.getElementById('selectGrupo').value;

    if (!isNaN(index) && index >= 0 && index < alumnos.length) {
        const alumno = alumnos[index];
        alumno.grupo = nombreGrupo;

        let grupo = grupos.find(g => g.nombre === nombreGrupo);
        if (!grupo) {
            //Si el grupo no existe, se crea.
            grupo = new Grupo(nombreGrupo);
            grupos.push(grupo);
        }

        if (!grupo.alumnos.includes(alumno)) {
            grupo.alumnos.push(alumno);
        }

        localStorage.setItem('alumnos', JSON.stringify(alumnos));
        localStorage.setItem('grupos', JSON.stringify(grupos));
        actualizarTablaAlumnos();
    } else {
        console.error('Índice de alumno no válido');
    }
});

document.getElementById('buscarNombreBtn').addEventListener('click', function() {
    const nombre = document.getElementById('buscarNombre').value;
    let alumnosFiltrados = alumnos.filter(a => a.nombre === nombre);

    if (alumnosFiltrados.length === 0) {
        alert('Alumno no encontrado.');
        document.getElementById('buscarNombre').value = '';
        return;
    }

    if (alumnosFiltrados.length > 1) {
        const apellido = prompt("Se encontraron varios alumnos con el mismo nombre. Por favor ingresa el apellido:");
        alumnosFiltrados = alumnosFiltrados.filter(a => a.apellidos === apellido);

        if (alumnosFiltrados.length === 0) {
            alert('Alumno no encontrado.');
            document.getElementById('buscarNombre').value = '';
            return;
        }

        if (alumnosFiltrados.length > 1) {
            const matricula = prompt("Se encontraron varios alumnos con el mismo nombre y apellido. Por favor ingresa la matrícula:");
            alumnosFiltrados = alumnosFiltrados.filter(a => a.matricula === matricula);

            if (alumnosFiltrados.length === 0) {
                alert('Alumno no encontrado.');
                document.getElementById('buscarNombre').value = '';
                return;
            }
        }
    }

    const alumno = alumnosFiltrados[0];
    alert(`Alumn@ encontrad@: Nombre: ${alumno.nombre} ${alumno.apellidos}, Edad: ${alumno.edad}, Matrícula: ${alumno.matricula}, Promedio: ${alumno.obtenerPromedio().toFixed(2)}, Grupo Asignado: ${alumno.grupo || 'No asignado'}`);
    document.getElementById('buscarNombre').value = '';
});

document.getElementById('buscarApellidoBtn').addEventListener('click', function() {
    const apellido = document.getElementById('buscarApellido').value;
    let alumnosFiltrados = alumnos.filter(a => a.apellidos === apellido);

    if (alumnosFiltrados.length === 0) {
        alert('Alumno no encontrado.');
        document.getElementById('buscarApellido').value = '';
        return;
    }

    if (alumnosFiltrados.length > 1) {
        const nombre = prompt("Se encontraron varios alumnos con el mismo apellido. Por favor ingresa el nombre:");
        alumnosFiltrados = alumnosFiltrados.filter(a => a.nombre === nombre);

        if (alumnosFiltrados.length === 0) {
            alert('Alumno no encontrado.');
            document.getElementById('buscarApellido').value = '';
            return;
        }

        if (alumnosFiltrados.length > 1) {
            const matricula = prompt("Se encontraron varios alumnos con el mismo nombre y apellido. Por favor ingresa la matrícula:");
            alumnosFiltrados = alumnosFiltrados.filter(a => a.matricula === matricula);

            if (alumnosFiltrados.length === 0) {
                alert('Alumno no encontrado.');
                document.getElementById('buscarApellido').value = '';
                return;
            }
        }
    }

    const alumno = alumnosFiltrados[0];
    alert(`Alumn@ encontrad@: Nombre: ${alumno.nombre} ${alumno.apellidos}, Edad: ${alumno.edad}, Matrícula: ${alumno.matricula}, Promedio: ${alumno.obtenerPromedio().toFixed(2)}, Grupo Asignado: ${alumno.grupo || 'No asignado'}`);
    document.getElementById('buscarApellido').value = '';
});

document.getElementById('buscarMatriculaBtn').addEventListener('click', function() {
    const matricula = document.getElementById('buscarMatricula').value;
    const alumno = alumnos.find(a => a.matricula === matricula);
    
    if (alumno) {
        alert(`Alumn@ encontrad@: Nombre: ${alumno.nombre} ${alumno.apellidos}, Edad: ${alumno.edad}, Matrícula: ${alumno.matricula}, Promedio: ${alumno.obtenerPromedio().toFixed(2)}, Grupo Asignado: ${alumno.grupo || 'No asignado'}`);
        document.getElementById('buscarMatricula').value = '';
    } else {
        alert('Alumno no encontrado.');
        document.getElementById('buscarMatricula').value = '';

    }
});

document.getElementById('promedioAlumnoBtn').addEventListener('click', function() {
    const matricula = prompt('Ingrese la matrícula del alumno para obtener el promedio:');
    const alumno = alumnos.find(a => a.matricula === matricula);
    
    if (alumno) {
        alert(`El promedio de ${alumno.nombre} ${alumno.apellidos} es de ${alumno.obtenerPromedio().toFixed(2)}`);
    } else {
        alert('Alumno no encontrado.');
    }
});

document.getElementById('promedioGrupoBtn').addEventListener('click', function() {
    const nombreGrupo = prompt('Ingrese el nombre del grupo para obtener el promedio:');
    const grupo = grupos.find(g => g.nombre === nombreGrupo);
    
    if (grupo) {
        alert(`El promedio del grupo ${grupo.nombre} es de ${grupo.obtenerPromedioGrupo().toFixed(2)}`);
    } else {
        alert('Grupo no encontrado.');
    }
});

document.getElementById('ordenarAscBtn').addEventListener('click', function() {
    const alumnosOrdenados = [...alumnos].sort((a, b) => a.obtenerPromedio() - b.obtenerPromedio());
    alert(`Alumnos ordenados ascendentemente por calificación: ${alumnosOrdenados.map(a => `${a.nombre} ${a.apellidos} (${a.obtenerPromedio().toFixed(2)})`).join(', ')}`);
});

document.getElementById('ordenarDescBtn').addEventListener('click', function() {
    const alumnosOrdenados = [...alumnos].sort((a, b) => b.obtenerPromedio() - a.obtenerPromedio());
    alert(`Alumnos ordenados descendentemente por calificación: ${alumnosOrdenados.map(a => `${a.nombre} ${a.apellidos} (${a.obtenerPromedio().toFixed(2)})`).join(', ')}`);
});


// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    alumnos = convertirAlumnos(JSON.parse(localStorage.getItem('alumnos')) || []);
    grupos = convertirGrupos(JSON.parse(localStorage.getItem('grupos')) || []);

    actualizarTablaAlumnos();
    actualizarSelectAlumnos();
    actualizarSelectGrupos();
});