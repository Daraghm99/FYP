/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async requestAssetRegistration(ctx, serialNumber, manufacturer, model, owner){
		
        console.info('============= START : Registraton Request ===========');

		// Check if the E-Scooter is already present on the ledger
		// Will ensure E-Scooter is not present in either a pending or registered status 
        const exists = await this.AssetExists(ctx, serialNumber);
        if (exists) {
            throw new Error(`The asset ${serialNumber} already exists`);
        }
       
        const scooter = {
        	ID: serialNumber, 
        	Manufacturer: manufacturer, 
        	Model: model, 
        	Owner: owner,
        	Status: 'pending',
        };
        
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(scooter))));

        console.info('============= END : Registraton Request ===========');

        return JSON.stringify(scooter);
	}


    async queryMyAssets(ctx, owner) {

        console.info('============= START : Query Owner Assets ===========');

        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if(record.Owner === owner){
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);

        console.info('============= END : Query Owner Assets ===========');

        return JSON.stringify(allResults);
    }

    async transferAsset(ctx, id, newOwner){
        
        console.info('============= START : Transfer Asset Ownership ===========');

        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwner;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));

        console.info('============= END : Transfer Asset Ownership ===========');

        return oldOwner;
    }

    async markAssetStolen(ctx, id){
        
    }


    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }


}

module.exports = FabCar;
