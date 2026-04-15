const prisma = require("../config/prisma");

const getAlumnos = async () => {
    return await prisma.alumnos.findMany();
};

const getAlumnoById = async (id) => {
    const alumno = await prisma.alumnos.findUnique({
        where: { id: Number(id) }
    });
    if (!alumno) {
        throw new Error('Alumno no encontrado');
    }
    return alumno;
};

const createAlumno = async ({ nombre, apellido, matricula, carrera, semestre, correo }) => {
    const existeMatricula = await prisma.alumnos.findUnique({
        where: { matricula }
    });
    if (existeMatricula) {
        throw new Error('La matrícula ya está registrada');
    }

    const existeCorreo = await prisma.alumnos.findUnique({
        where: { correo }
    });
    if (existeCorreo) {
        throw new Error('El correo ya está registrado');
    }

    const alumno = await prisma.alumnos.create({
        data: { nombre, apellido, matricula, carrera, semestre: Number(semestre), correo }
    });
    return {
        message: 'Alumno registrado correctamente',
        alumno
    };
};

const updateAlumno = async (id, { nombre, apellido, matricula, carrera, semestre, correo }) => {
    const alumno = await prisma.alumnos.findUnique({
        where: { id: Number(id) }
    });
    if (!alumno) {
        throw new Error('Alumno no encontrado');
    }

    const updatedAlumno = await prisma.alumnos.update({
        where: { id: Number(id) },
        data: { nombre, apellido, matricula, carrera, semestre: Number(semestre), correo }
    });
    return {
        message: 'Alumno actualizado correctamente',
        alumno: updatedAlumno
    };
};

const deleteAlumno = async (id) => {
    const alumno = await prisma.alumnos.findUnique({
        where: { id: Number(id) }
    });
    if (!alumno) {
        throw new Error('Alumno no encontrado');
    }

    await prisma.alumnos.delete({
        where: { id: Number(id) }
    });
    return {
        message: 'Alumno eliminado correctamente',
        alumno
    };
};

module.exports = {
    getAlumnos,
    getAlumnoById,
    createAlumno,
    updateAlumno,
    deleteAlumno
};
