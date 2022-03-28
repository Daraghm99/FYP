import { Gateway, Wallets } from 'fabric-network';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import bcrypt from 'bcrypt';

import { registerUser } from '../utils/authentication.js'

// load the network configuration
const ccpPath = process.env.ORG1_CONNECTION;
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

// Create a new file system based wallet for managing identities.
const walletPath = process.env.WALLET_PATH;
const wallet = await Wallets.newFileSystemWallet(walletPath);

export const createUser = async (req, res) => {

    // Create a certificate for the user
    await registerUser(req.body.email);

    try {

        // Create a new gateway for connecting to the peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.body.email, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        // Encrypt the password using a hashing algorithm before it gets stored in the ledger
        // Generating the Salt
        const salt = await bcrypt.genSalt(10);
        // Hashing the password
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        let result = await contract.submitTransaction('createUser', req.body.email, req.body.name, hashedPassword, req.body.role);
        
        console.log('Transaction has been submitted');
        
        if (`${result}` !== '') {
            res.send(JSON.parse(result.toString())).status(200);

        } else {
            res.send('Unable to Register User').status(400);
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

export const getUser = async (req, res) => {

    try {

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.body.email, discovery: { enabled: true, asLocalhost: true } });

        // Get the Channel the Contract is deployed on using the channel name.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);
        const contract = network.getContract(process.env.SCOOT_CONTRACT);
    
        // Check if a user exists with the email (ID) provided
        const result = await contract.evaluateTransaction('queryUser', req.body.email);
        // Retrieve the result object and parse the JSON data
	    const user = JSON.parse(result.toString());
    
        if(user != ''){
            // Compare the encypted password in the ledger with the input
            const validPassword = await bcrypt.compare(req.body.password, user.Password);

            if(validPassword){
                // Create and assign a JWT token
                // JWT Token will contain the email, name, and role of the user and will expire after 30 minutes
                const token = jwt.sign({ID: user.ID, Name: user.Name, Role: user.Role}, process.env.TOKEN_SECRET, { expiresIn: "30m" });
                res.header('authToken', token).send(token);
            } else {
                res.status(401).json({ message: 'Invalid Password' });
            }
        } else {
            res.status(403).json({ message: 'Invalid Email' });
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
}
