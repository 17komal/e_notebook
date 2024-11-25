const jwt = require('jsonwebtoken');
const jwtSecrectKey = "1e5a289dd9c6442c8f2a75aaabdddf67";///process.env.JWT_SECRET_KEY;

const fetchUser = (req, res, next) => {
    const auth_token = req.header('auth-token');
    if (!auth_token) {
        res.status(401).send({ error: "Invalid Authentication" });
    }
    try {
        const data = jwt.verify(auth_token,jwtSecrectKey);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Invalid Authentication." });
    }

    
}
module.exports = fetchUser