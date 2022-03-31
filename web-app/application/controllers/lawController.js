import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';

// load the network configuration and Wallet configurations
const ccp = JSON.parse(fs.readFileSync(process.env.ORG3_CONNECTION, 'utf8'));
const wallet = await Wallets.newFileSystemWallet(process.env.WALLET_PATH);

export const reviewScooter = async (req, res) => {

    try {
        
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        let result = await contract.evaluateTransaction('ReadAsset', req.body.serialNumber);

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

export const getStolenScooters = async (req, res) => {

    try {
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        console.log(req.user.ID);
        const result = await contract.evaluateTransaction('queryStolenScooters');
	    
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

