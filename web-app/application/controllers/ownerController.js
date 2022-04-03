import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';

// load the network configuration and Wallet configurations
const ccp = JSON.parse(fs.readFileSync(process.env.ORG1_CONNECTION, 'utf8'));
const wallet = await Wallets.newFileSystemWallet(process.env.WALLET_PATH);

export const createScooterRequest = async (req, res) => {

    try {

        // Create a new gateway for connecting to the peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
         // Get the contract from the network.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        
        let result = await contract.submitTransaction('requestAssetRegistration', req.body.serialNumber, req.body.manufacturer, req.body.model, req.user.ID, req.body.retailer);
        
        console.log('Transaction Submitted');
        
        console.log(JSON.parse(result));
        if (JSON.parse(result) === 'Asset Exists') {
            res.status(409).send('Asset Exists on the Network');
        } else if (JSON.parse(result) === 'No Retailer Found') {
            res.status(410).send('Retailer Not Found');
        } else {
            res.send(JSON.parse(result)).status(200);
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

export const getMyScooters = async (req, res) => {

    try {

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        console.log(req.user.ID);
        const result = await contract.evaluateTransaction('queryMyAssets', req.user.ID);
	    
        console.log('Transaction has been evaluated');
        res.send(JSON.parse(result.toString())).status(200);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }

}

export const transferScooter = async (req, res) => {

    try {

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        const result = await contract.submitTransaction('transferAsset', req.body.serialNumber, req.body.newOwner);
        
        console.log(JSON.parse(result));

        if(JSON.parse(result) === 'User Error'){
            res.status(405).send('User Not Found');
        } else if (JSON.parse(result) === 'Self Transfer'){
            res.status(406).send('Self Transfer');
        } else{
            res.status(200).send(JSON.parse(result));
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }

}

export const markScooterStolen = async (req, res) => {

    try {

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        await contract.submitTransaction('markAssetStolen', req.body.serialNumber);
	    res.send('Asset Status Updated').status(200)

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }

}

export const getScooterStatus = async (req, res) => {

    try {
        
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        let result = await contract.evaluateTransaction('getAssetStatus', req.body.serialNumber);

        console.log(result.toString());
        console.log(JSON.parse(result));

        if(JSON.parse(result) == 'Asset Not Found'){
            res.status(404).send(result.toString());
        } else {
            res.send(result.toString()).status(200);
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }

}

export const getScooterServiceHistory = async (req, res) => {

    try {
        
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        let result = await contract.evaluateTransaction('queryAssetServiceHistory', req.body.serialNumber);

        if(JSON.parse(result) === 'Not Found'){
            res.status(405).send('Asset Not Found');
        } else {
            res.send(JSON.parse(result.toString())).status(200);
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
}

export const getScooterHistory = async (req, res) => {

    try {
        
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        let result = await contract.evaluateTransaction('queryAssetHistory', req.body.serialNumber);

        if(JSON.parse(result) === 'E-Scooter Not Found'){
            res.status(405).send('E-Scooter Not Found');
        } else {
            res.send(JSON.parse(result.toString())).status(200);
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
}
