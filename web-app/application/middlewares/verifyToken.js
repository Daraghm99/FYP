import jwt from 'jsonwebtoken'

export default function (req, res, next){
    // Retrieve the token from the header of the request
    const token = req.header('authToken');
    // If no token was included send Acess Denied
    if(!token) return res.status(401).send('Access Denied');

    try{
        // Verify the JSON Web Token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        // Create a verified user object
        req.user = verified;
        console.log('The user currently logged in is ' + req.user.ID + ' Their role is: ' + req.user.Role);
        next();
    }catch(err){
        res.status(400).send('invalid Token');
    }
}