import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';

// load the network configuration and Wallet configuration
const ccp = JSON.parse(fs.readFileSync(process.env.ORG2_CONNECTION, 'utf8'));
const wallet = await Wallets.newFileSystemWallet(process.env.WALLET_PATH);

export const registerScooter = async (req, res) => {

    try {

        // Create a new gateway for connecting to the peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        let result = await contract.submitTransaction('createAsset', req.body.serialNumber, req.body.manufacturer, req.body.model, req.body.owner, req.user.Name);
        
        if (JSON.parse(result) === 'Asset Exists') {
            res.status(405).send('E-Scooter Exists');
        } else if (JSON.parse(result) === 'User Not Found'){
            res.status(406).send('User Not Found');
        } else if (JSON.parse(result) === 'User Role Error'){
            res.status(407).send('User Role Error');
        } else {
            res.send(JSON.parse(result.toString())).status(200);
        }
        
        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }

}

export const getMyRequests = async (req, res) => {

    try {
        
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        const result = await contract.evaluateTransaction('queryMyRequests', req.user.Name);
	    
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

export const approveRequest = async (req, res) => {

    try {

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        await contract.submitTransaction('approveAssetRegistration', req.body.serialNumber);
	    console.log('Transaction has been submitted');
        res.send('Asset Registered').status(200);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
    
}

export const rejectRequest = async (req, res) => {

    try {

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'retailer@gmail.com', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        await contract.submitTransaction('rejectAssetRegistration', req.body.serialNumber);
	    console.log('Transaction has been submitted');
        res.send('Asset Registration Rejected').status(200);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
    
}