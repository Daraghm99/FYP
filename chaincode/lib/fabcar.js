
'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async requestAssetRegistration(ctx, serialNumber, manufacturer, model, owner, retailer){
		
        console.info('============= START : Registraton Request ===========');

		// Check if the E-Scooter is already present on the ledger
		// Will ensure E-Scooter is not present in either a pending or registered status 
        const exists = await this.AssetExists(ctx, serialNumber);
        if (exists) {
            throw new Error(`The asset ${serialNumber} already exists`);
        }
       
        const scooter = {
        	SerialNumber: serialNumber, 
        	Manufacturer: manufacturer, 
        	Model: model, 
        	Owner: owner,
        	Retailer: retailer,
        	Status: 'pending',
        	State: 'active',
        };
        
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(scooter))));

        console.info('============= END : Registraton Request ===========');

        return JSON.stringify(scooter);
	}
	
	async createAsset(ctx, serialNumber, manufacturer, model, owner, retailer){
		
        console.info('============= START : E-Scooter Registration ===========');

		// Check if the E-Scooter is already present on the ledger
		// Will ensure E-Scooter is not present in either a pending or registered status 
        const exists = await this.AssetExists(ctx, serialNumber);
        if (exists) {
            throw new Error(`The asset ${serialNumber} already exists`);
        }
       
        const scooter = {
        	SerialNumber: serialNumber, 
        	Manufacturer: manufacturer, 
        	Model: model, 
        	Owner: owner,
        	Retailer: retailer,
        	Status: 'Pending',
        	State: 'Active',
        };
        
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(scooter))));

        console.info('============= END : E-Scooter Registration ===========');

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
    
    async queryMyRequests(ctx, owner) {

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
            if(record.Retailer === retailer && record.Status === 'Pending'){
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);

        console.info('============= END : Query Owner Assets ===========');

        return JSON.stringify(allResults);
    }
    
    async transferAsset(ctx, serialNumber, newOwner){
        
        console.info('============= START : Transfer Asset Ownership ===========');

        const assetString = await this.ReadAsset(ctx, serialNumber);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwner;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(asset))));

        console.info('============= END : Transfer Asset Ownership ===========');

    }

    async markAssetStolen(ctx, serialNumber){
    
    	console.info('============= START : Mark Asset Stolen ===========');
    	
    	const exists = await this.AssetExists(ctx, serialNumber);
        if (!exists) {
            throw new Error(`The asset ${serialNumber} does not exist`);
        }
        
        const assetString = await this.ReadAsset(ctx, serialNumber);
        const asset = JSON.parse(assetString);

        // overwriting original asset with new asset
        const updatedAsset = {
        	SerialNumber: asset.SerialNumber, 
        	Manufacturer: asset.Manufacturer, 
        	Model: asset.Model, 
        	Owner: asset.Owner,
        	Retailer: asset.Retailer,
        	Status: asset.Status,
        	State: 'Stolen',
        };
        
        console.info('============= END : Mark Asset Stolen ===========');
        
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
        
    }
    
    async approveAssetRegistration(ctx, serialNumber){
    
    	console.info('============= START : Approve Registration Request ===========');
    	
    	const exists = await this.AssetExists(ctx, serialNumber);
        if (!exists) {
            throw new Error(`The asset ${serialNumber} does not exist`);
        }
        
        const assetString = await this.ReadAsset(ctx, serialNumber);
        const asset = JSON.parse(assetString);

        // overwriting original asset with new asset
        const updatedAsset = {
        	SerialNumber: asset.SerialNumber, 
        	Manufacturer: asset.Manufacturer, 
        	Model: asset.Model, 
        	Owner: asset.Owner,
        	Retailer: asset.Retailer,
        	Status: "Registered",
        	State: asset.State,
        };
        
        console.info('============= END : Approve Registration Request ===========');
        
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
        
    }
    
    async getAssetStatus(ctx, serialNumber){
    
    	console.info('============= START : Get Asset Status ===========');	
    
    	const assetString = await this.ReadAsset(ctx, serialNumber);
        const asset = JSON.parse(assetString);
        const assetState = asset.State; // get the asset from chaincode state
        
        console.info('============= END : Get Asset Status ===========');	
        
        return assetState.toString();
    	
    }

	async ReadAsset(ctx, serialNumber) {
        const assetJSON = await ctx.stub.getState(serialNumber); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${serialNumber} does not exist`);
        }
        return assetJSON.toString();
    }

    async AssetExists(ctx, serialNumber) {
        const assetJSON = await ctx.stub.getState(serialNumber);
        return assetJSON && assetJSON.length > 0;
    }


}

module.exports = FabCar;
