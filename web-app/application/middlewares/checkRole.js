
export const checkOwner = (req, res, next) => {

    try{
        if (req.user.Role != 'owner'){
            res.status(403).send('Permissions error');
        } else {
            next();
        }
        
    }catch(err){
        res.status(400).send('invalid Permissions');
    }
}

export const checkRetailer = (req, res, next) => {

    try{
        if (req.user.Role != 'retailer'){
            res.status(403).send('Permissions error');
        } else {
            next();
        }
        
    }catch(err){
        res.status(400).send('invalid Permissions');
    }
}

export const checkLaw = (req, res, next) => {

    try{
        if (req.user.Role != 'law'){
            res.status(403).send('Permissions error');
        } else {
            next();
        }
        
    }catch(err){
        res.status(400).send('invalid Permissions');
    }
}

