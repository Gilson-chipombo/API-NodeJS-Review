const jwt = require('json-web-token');
const dotenv = require('dotenv');
const { head } = require('../routes/userRoutes');

dotenv.config();

function auth(req, res, next){
    const header = req.headers['authorization'];

    if(!header) return res.status(401).json({error: 'Authorization header missing'});
    const parts = header.split(' ');

    
    console.log("tamanho= "+parts.length);
    console.log("Bearer= "+parts[0]);
    

    if (parts.length != 2 || parts[0] != 'Bearer') return res.status(401).json({error: 'Invalid Authorization format'});

    const token = parts[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // {id, email, role, iat, exp}
        return next();
    } catch (error) {
        return res.status(401).json({error: 'Invaliddd or expired token'});
    }
}

module.exports = auth;