const { response } = require("express");
const Event = require('../models/Event');

const getEvents = async(req, res = response) => {

    const events = await Event.find()
        .populate('user', 'name');

    res.json({
        ok: true,
        events
    });

}

const createEvent = async(req, res = response) => {

    const event = new Event( req.body );

    try{

        event.user = req.uid;

        const eventSaved = await event.save();

        res.status(201).json({
            ok: true,
            event: eventSaved
        });

    }catch( error ){

        console.log( error );
        res.status(500).json({
            ok: false,
            message: "Error, hable con el administrador"
        });

    }

}

const updateEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try{

        const event = await Event.findById( eventId );

        if( !event ){
            return res.status(404).json({
                ok: false,
                message: "Evento no existe con ese ID"
            });
        }

        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                message: "No tiene privilegios para editar este evento"
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        };

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.json({
            ok: true,
            event: eventUpdated
        });

    }catch( error ){

        console.log( error );
        res.status(500).json({
            ok: false,
            message: "Error, hable con el administrador"
        });

    }

}

const deleteEvent = async( req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try{

        const event = await Event.findById( eventId );

        if( !event ){
            return res.status(404).json({
                ok: false,
                message: "Evento no existe con ese ID"
            });
        }

        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                message: "No tiene privilegios para eliminar este evento"
            });
        }

        const evenDeleted = await Event.findByIdAndDelete( eventId );

        res.json({
            ok: true,
            message: "El evento ha sido eliminado correctamente!"
        });

    }catch( error ){

        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Error, hable con el administrador"
        });

    }

}


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}