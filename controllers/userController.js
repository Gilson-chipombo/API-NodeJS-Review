const bcrypt = require('bcrypt');
const jwt = require('json-web-token')
const dotenv = require('dotenv')

dotenv.config();

const userModel = require('../models/userModels');
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

const register = async (req, resizeBy, next) =>{
    try {
            const {name, email, pssword} = req.body;
            const existing = await userModel.findUserByEmail(email);
            if (existing) return res.status(409).json({error: 'Email already exists'});
            const hashed = await bcrypt.hash(pssword, saltRounds);
            const user = await userModel.createUser({name, email, pssword: hashed});
            res.status(201).json(user, {success: 'created'});
    } catch (error) {
        console.log("Error to try register");
        next(error);
    }
};

const login = async (req, res, next) =>{
    try {
        const {email, pssword} = req.body;
        const user = await userModel.findUserByEmail(email);
        if(!user) return res.status(401).json({error: 'Invalid Credentials'});
        const ok = await bcrypt.compare(pssword, user.pssword);
        if (!ok) return res.status(401).json({error: 'Invalid Credentials'});
        const payload = {id: user.id, email: user.email, role: user.role};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '1h'});

        return res.status(200).json({token, user: {id: user.id, name: user.name, email: user.email, role: user.email}})

    } catch (error) {
        next(error)
    }
};

const getProfile = async (req, res, next) =>{
    try {
        const id = req.body;
        const user = await userModel.findUserById(id);
        if (!user) res.status(404).json({error:'User not fount'});
    
        return res.status(200).json({user});   
    
    } catch (error) {
        next(err);
    }
};

const getUser = async (req, res, next) =>{
    try {
        const id = req.body;
        const user = await userModel.findUserById(id);
        if (!user) return res.status(404).json({error: 'User not found'});
    
        return res.status(200).json({user});
    
    } catch (error) {
        next(error);
    }
};

const listUsers = async (req, res, next) =>{
    try {
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const offset = (page - 1) * limit;
        const users = await userModel.allUsers({limit, offset});
        
        res.status(200).json({users});
    
    } catch (error) {
        next(error);
    }
};

const updateUser = async(req, res, next) =>{
    try {
        const id = req.body;
        const update = await userModel.updateUser(id, req.body);
        if (!update) return res.status(404).json({error: 'User not found'});
        
        res.status(200).json({update}); 

    } catch (error) {
        next(error);
    }
};

const removeUser = async(req, res, next) =>{
    try {
        const id = req.body;
        const deleted = userModel.deleteUser(id);
        if (!deleted) return res.status(404).json({error: 'User not found'});
        res.status(200).json({deleted});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    getUser,
    listUsers,
    updateUser,
    removeUser
};