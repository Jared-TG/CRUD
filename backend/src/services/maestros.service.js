const prisma = require("../config/prisma");

const getMaestros = async () => {
    return await prisma.maestros.findMany();
};

const getMaestroById = async (id) => {
    const maestro = await prisma.maestros.findUnique({
        where: { id: Number(id) }
    });
    if (!maestro) {
        throw new Error('Maestro no encontrado');
    }
    return maestro;
};

const createMaestro = async ({ nombre, apellido, correo, numero_empleado, departamento }) => {
    const existeCorreo = await prisma.maestros.findUnique({
        where: { correo }
    });
    if (existeCorreo) {
        throw new Error('El correo ya está registrado');
    }

    const existeNumero = await prisma.maestros.findUnique({
        where: { numero_empleado }
    });
    if (existeNumero) {
        throw new Error('El número de empleado ya está registrado');
    }

    const maestro = await prisma.maestros.create({
        data: {
            nombre,
            apellido,
            correo,
            numero_empleado,
            departamento
        }
    });
    return {
        message: 'Maestro registrado correctamente',
        maestro
    };
};

const updateMaestro = async (id, { nombre, apellido, correo, numero_empleado, departamento }) => {
    const maestro = await prisma.maestros.findUnique({
        where: { id: Number(id) }
    });
    if (!maestro) {
        throw new Error('Maestro no encontrado');
    }

    const updatedMaestro = await prisma.maestros.update({
        where: { id: Number(id) },
        data: {
            nombre,
            apellido,
            correo,
            numero_empleado,
            departamento
        }
    });
    return {
        message: 'Maestro actualizado correctamente',
        maestro: updatedMaestro
    };
};

const deleteMaestro = async (id) => {
    const maestro = await prisma.maestros.findUnique({
        where: { id: Number(id) }
    });
    if (!maestro) {
        throw new Error('Maestro no encontrado');
    }

    await prisma.maestros.delete({
        where: { id: Number(id) }
    });
    return {
        message: 'Maestro eliminado correctamente',
        maestro
    };
};

module.exports = {
    getMaestros,
    getMaestroById,
    createMaestro,
    updateMaestro,
    deleteMaestro
};
