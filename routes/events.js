//! Rutas de eventos
//* host + /api/events

const { Router } = require("express");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/eventsController");

//Middlewares
const { validateJwt } = require("../middlewares/validateJwt");
const { check } = require("express-validator");
const { fieldsValidator } = require("../middlewares/fieldsValidator");

//Helpers
const { isDate } = require("../helpers/isDate");

const router = Router();

// Todas las peticiones tienen que pasar por este middleware
// Se debe colocar antes de las rutas que la requieren
// Se puede desplazar hacia abajo de rutas que no requieran este middleware
router.use( validateJwt );

//Obtener Eventos
router.get("/", getEvents);

//Crear un nuevo evento
router.post(
    "/", 
    [ //Middlewares
        check("title", "El título es obligatorio").not().isEmpty(),
        check("start", "Fecha de inicio es obligatoria").custom( isDate ),
        check("end", "Fecha de finalización es obligatoria").custom( isDate ),
        fieldsValidator
    ],
    createEvent
);

// Actualizar evento
router.put("/:id",
    [
        check("title", "El título es obligatorio").not().isEmpty(),
        check("start", "Fecha de inicio es obligatoria").custom( isDate ),
        check("end", "Fecha de finalización es obligatoria").custom( isDate ),
        fieldsValidator
    ], 
    updateEvent
);

// Eliminar evento
router.delete("/:id", deleteEvent);

module.exports = router