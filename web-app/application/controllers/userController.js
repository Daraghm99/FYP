import { Gateway, Wallets } from 'fabric-network';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { registerUser } from '../utils/authentication.js'

// load the network configuration
const ccpPath = process.env.ORG1_CONNECTION;
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

// Create a new file system based wallet for managing identities.
const walletPath = process.env.WALLET_PATH;
const wallet = await Wallets.newFileSystemWallet(walletPath);

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

export const createUser = async (req, res) => {

    try {
        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for this user does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to the peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract('scoot');

        let result = await contract.submitTransaction('createUser', req.body.email, req.body.name, req.body.password, req.body.role);
        
        console.log('Transaction has been submitted');
        if (`${result}` !== '') {
            console.log(`*** Request Asset Registration Result: ${prettyJSONString(result.toString())}`);
            res.send(result.toString());

            // Create a certificate for the user
            registerUser(req.body.email);
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
        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract('scoot');

        const result = await contract.evaluateTransaction('queryUser', req.body.email);
	    
        console.log('Transaction has been evaluated');
        console.log(`User: ${prettyJSONString(result.toString())}`);
        const user = JSON.parse(result.toString());

        if(req.body.email == user.ID && req.body.password === user.Password){
            console.log('Logged In');
            
            // Create and assign a JWT token
            const token = jwt.sign({ID: user.ID, Role: user.Role}, process.env.TOKEN_SECRET);
            res.header('authToken', token).send(token);
        } else {
            return res.status(400).send('Credentials Incorrect');
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
}