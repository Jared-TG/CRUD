const prisma = require("../config/prisma");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const deleteUser = async (id) => {
    const user = await prisma.users.findUnique({
        where : { id: Number(id) }
    })
    if (!user) {
        throw new Error('usuario no existe');
    }
    await prisma.users.delete({
        where : { id: Number(id) }
    });
    return {
        message : 'Usuario eliminado correctamente',
        userId : user.id,
        name : user.NAME,
        email : user.email
    }
}

const updateUser = async (id, { name, email, password }) => {
    const user = await prisma.users.findUnique({
        where: { id: Number(id) }
    });
    if (!user) {
        throw new Error ('usuario no existe');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await prisma.users.update({
        where: { id: Number(id) },
        data: {
            NAME: name,
            email,
            PASSWORD: hashedPassword
        }
    });
    return {
        message : 'Usario registrado correctamente',
        userId : updatedUser.id,                name : updatedUser.NAME,
        email : updatedUser.email,
        password : updatedUser.PASSWORD
    };
};


const register = async ({name, email, password}) => {
    const existeUsuario = await prisma.users.findUnique({
        where : { email }
    });
    if (existeUsuario){
        throw new Error('El correo ya está registrado');
    }
    const hashedPasword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data : {
            NAME: name,
            email,
            PASSWORD : hashedPasword
        }
    });
    return {
        message : 'Usario registrado correctamente',
        userId : user.id,
        name : user.NAME,
        email : user.email
    }
}

const login = async ({email, password}) => {

    const user = await prisma.users.findUnique({
        where : { email }
    });

    if (!user) {
        throw new Error('Credenciales invalidad');
    }

    const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);

    if (!isPasswordValid) {
        throw new Error('Credenciales invalidad');
    }
    console.log(user.PASSWORD);

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        message : 'Login correcto',
        token : token,
        user : {
        id: user.id,
        name: user.NAME,
        email: user.email
        }
    }

}

const getUsers = async () => {
    return await prisma.users.findMany({
        select : {
            id : true,
            NAME : true,
            email : true
        }
    });
}

const getUserById = async (id) => {
    const user = await prisma.users.findUnique({
        where : { id: Number(id) },
        select : {
            id : true,
            NAME : true,
            email : true
        }
    });

    if (!user) {
        throw new Error('usuario no encontrados');
    }
    return user;
}


module.exports = {
    login,
    register,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};