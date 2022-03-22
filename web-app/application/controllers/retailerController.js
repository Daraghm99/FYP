import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import path from 'path';

// load the network configuration
const ccpPath = path.join(process.cwd(), './connection/connection-org2.json');
console.log(ccpPath);
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = await Wallets.newFileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);

export const registerScooter = async (req, res) => {

}

export const getMyRequests = async (req, res) => {
    
}

export const approveRequest = async (req, res) => {
    
}