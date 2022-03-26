import jwt from 'jsonwebtoken'

export default function (req, res, next){
    const token = req.header('authToken');
    if(!token) return res.status(401).send('Access Denied');

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log('The user currently logged in is ' + req.user.ID + ' Their role is: ' + req.user.Role);
        next();
    }catch(err){
        res.status(400).send('invalid Token');
    }
}