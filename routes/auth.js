//! User Routes / Auth
//* host + /api/auth

const { Router } = require("express");
const { check } = require("express-validator");
const { fieldsValidator } = require("../middlewares/fieldsValidator");

const { createUser, loginUser, renewToken } = require("../controllers/authController");
const { validateJwt } = require("../middlewares/validateJwt");

const router = Router();



//!POST
router.post(
    "/", 
    [   //Middlewares
        check("email", "El email es obligatorio").isEmail(),
        check("password", "La contraseña debe ser de 6 caracteres").isLength({ min: 6 }),
        fieldsValidator
    ],
    loginUser
);

router.post(
    "/new", 
    [ //Middlewares
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("email", "El email es obligatorio").isEmail(),
        check("password", "La contraseña debe ser de 6 caracteres").isLength({ min: 6 }),
        fieldsValidator
    ],
    createUser
);

//*GET
router.get("/renew", validateJwt, renewToken);

module.exports = router