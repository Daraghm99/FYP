/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import FabricCAServices from 'fabric-ca-client';
import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import 'dotenv/config';
import bcrypt from 'bcrypt';

// load the network configuration
const ccpPath = process.env.ORG1_CONNECTION;
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

// Create a new file system based wallet for managing identities.
const walletPath = process.env.WALLET_PATH;
const wallet = await Wallets.newFileSystemWallet(walletPath);

async function main() {
    
    try {

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('registrar', x509Identity);
        console.log('Successfully Registered and Enrolled the network Registrar');

        // Register the Registrar on the Ledger
        await register();

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

async function register() {
    
    try {

        // Create a new gateway for connecting to the peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'registrar', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(process.env.SCOOT_CONTRACT);

        // Encrypt the password using a hashing algorithm before it gets stored in the ledger
        // Generating the Salt
        const salt = await bcrypt.genSalt(10);
        // Hashing the password
        const hashedPassword = await bcrypt.hash(process.env.REGISTRAR_PASS, salt);

        await contract.submitTransaction('createUser', process.env.REGISTRAR_EMAIL, process.env.REGISTRAR, hashedPassword, process.env.REGISTRAR_ROLE);
        
        console.log('Registrar has been registered');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();