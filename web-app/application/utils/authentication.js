
import { Wallets } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';

export const registerUser = async (id) => {

    try {
        // load the network configuration
        const ccpPath = join(process.cwd(), './connection/connection-org1.json');
        const ccp = JSON.parse(readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const wallet = await Wallets.newFileSystemWallet(process.env.WALLET_PATH);

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('registrar');

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'registrar');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: id,
            role: 'client'
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: id,
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put(id, x509Identity);
        console.log('Successfully registered and enrolled');

    } catch (error) {
        console.error(`Failed to register user": ${error}`);
        process.exit(1);
    }
}


