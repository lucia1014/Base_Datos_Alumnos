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
}

inscribirMateria(materia) {
    if (!this.materiasInscritas.includes(materia)) {
        this.materiasInscritas.push(materia);
        this.calificaciones[materia] = null;
    }
}

asignarCalificacion(materia, calificacion) {
    if (this.materiasInscritas.includes(materia)) {
        this.calificaciones[materia] = calificacion;
    } else {
        alert('Materia no signada');
    }
}

obtenerPromedio() {
    //Se usa Object.values(this.calificaciones) para obtener un array con todas las calificaciones del alumno.
    const calificaciones = Object.values(this.calificaciones).filter(c => c !== null);
    //'reduce' aplica una función a un acumulador y a cada elemento del array (de izquierda a derecha) para 
    //reducirlo a un único valor (en este caso, la suma de todas las calificaciones).
    const total = calificaciones.reduce((acc, cal) => acc + cal, 0);
    return calificaciones.length ? total / calificaciones.length : 0;
}


class Grupo {
    constructor(nombre) {
        this.nombre = nombre;
        this.alumnos = [];
    }

    agregarAlumno(alumno) {

    }

    obtenerPromedioGrupo() {


    }
}


function actualizarTablaAlumnos() {

}

function actualizarSelectAlumnos(){

}


// Eventos