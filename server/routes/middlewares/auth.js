import jwt from 'jsonwebtoken'
import config from 'config'

const authenticateUser = (req, res, next) => {
    //Get token from header
    const token = req.header('x-auth-token');

    // check token 
    if (!token) {
        return (res.status(401).json({
            msg:'No token, authorization denied'
        }))
    }

    // verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({
            msg:'Invalid Token. Try login.'
        })
    }
}

export default authenticateUser;