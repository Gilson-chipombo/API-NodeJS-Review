const express = require('express');
const router =  express.Router();

const userController = require('../controllers/userController');
const {registerSchema, loginSchema, updateSchema} = require('../validators/userValidator');
const auth = require('../middlewares/auth');

//small validation middleware
function validate(schema){
    return (req, res, next) =>{
        const {error} = schema.validate(req.body);
        if (error) return res.status(400).json({error: error.details.map(d => d.message).join(', ')});
        next();
    };
}

router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);

router.get('/me', auth, userController.getProfile);

//CRUD endpoints
router.get('/', auth, userController.listUsers);
router.get('/:id', auth, userController.getUser);
router.put('/:id', auth, validate(updateSchema), userController.updateUser);
router.delete('/:id', auth, auth, userController.removeUser);

module.exports =  router;