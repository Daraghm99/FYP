import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// load the network configuration and Wallet configurations
const ccp = JSON.parse(fs.readFileSync(process.env.ORG4_CONNECTION, 'utf8'));
const wallet = await Wallets.newFileSystemWallet(process.env.WALLET_PATH);

export const createScooterService = async (req, res) => {

    try {

        // Create a new gateway for connecting to the peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.user.ID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
         // Get the contract from the network.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        // Create a unique Service Record ID by using the uuidv4 library
        const SID = uuidv4();

        let result = await contract.submitTransaction('createAssetService', SID, req.body.serialNumber, req.body.serviceDescription);
        
        console.log('Transaction Submitted');
        
        if (`${result}` !== '') {
            res.send(JSON.parse(result)).status(200);
        } else {
            res.send('Unable to Create Request').status(401);
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

