const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response ) => {

    const { email, password } = req.body;

    try{

        let user = await User.findOne({ email });

        if( user ){
            return res.status(400).json({ 
                ok: false,
                msg: "Ya existe un usuario con ese email"
            });
        }

        user = new User( req.body );

        // Encryp password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // Generate JWT
        const token = await generateJWT( user.id, user.name );

        res.status(201).json({ 
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    }catch(error){

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });

    }
}

const loginUser = async(req, res = response ) => {

    const { email, password } = req.body;

    try{

        const user = await User.findOne({ email });

        if( !user ){
            return res.status(400).json({ 
                ok: false,
                msg: "El usuario no existe con ese email"
            });
        }

        // Confirm Password
        const validator = bcrypt.compareSync( password, user.password );

        if( !validator ){
            return res.status(400).json({ 
                ok: false,
                msg: "Password incorrecto"
            });
        }

        // Generate JWT
        const token = await generateJWT( user.id, user.name );

        res.status(200).json({ 
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    }catch(error){

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });

    }
}

const renewToken = async(req, res = response ) => {

    const { uid, name } = req

    // Generate JWT
    const token = await generateJWT( uid, name );

    res.json({ 
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}
