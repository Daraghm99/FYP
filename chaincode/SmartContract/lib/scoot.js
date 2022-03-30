

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class Scoot extends Contract {

    async requestAssetRegistration(ctx, serialNumber, manufacturer, model, owner, retailer){
		
        console.info('============= START : Registraton Request ===========');

		// Check if the E-Scooter is already present on the ledger
		// Will ensure E-Scooter is not present in either a pending or registered status 
        const exists = await this.AssetExists(ctx, serialNumber);
        if (exists) {
            //throw new Error(`The asset ${serialNumber} already exists`);
            return JSON.stringify('Asset Exists');
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
        	Status: 'Registered',
        	State: 'Active',
        };
        
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(scooter))));

        console.info('============= END : E-Scooter Registration ===========');

        return JSON.stringify(scooter);
	}
	
	async createAssetService(ctx, SID, serialNumber, serviceDescription){
		
		console.info('============= START : Create Asset Service ===========');
		
		const service = {
			SID: SID,
			SerialNumber: serialNumber,
			ServiceDescription: serviceDescription
		};
		
		await ctx.stub.putState(SID, Buffer.from(stringify(sortKeysRecursive(service))));
		
		console.info('============= END : Create Asset Service ===========');
		
		return JSON.stringify(service);
		
	}
	
	async queryAssetServiceHistory(ctx, serialNumber){
		
		console.info('============= START : Query Asset History ===========');

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
            if(record.hasOwnProperty('ServiceDescription') && record.SerialNumber === serialNumber){
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);

        console.info('============= END : Query Asset History ===========');

        return JSON.stringify(allResults);
	}
	
	async queryAssetHistory(ctx, serialNumber){
		
		let iterator = await ctx.stub.getHistoryForKey(serialNumber);
    	let result = [];
    	let res = await iterator.next();
    	
    	while (!res.done) {
      		if (res.value) {
        		console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
        		const obj = JSON.parse(res.value.value.toString('utf8'));
        		result.push(obj);
      		}
      		res = await iterator.next();
    	}
    	await iterator.close();
    	return JSON.stringify(result);
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
    
    async queryMyRequests(ctx, retailer) {

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
        
        // Check if user exists
        const exists = await this.UserExists(ctx, newOwner);
        if(!exists){
        	return JSON.stringify('User Error');
        }

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
    
    async rejectAssetRegistration(ctx, serialNumber) {
        const exists = await this.AssetExists(ctx, serialNumber);
        if (!exists) {
            throw new Error(`The asset ${serialNumber} does not exist`);
        }
        return ctx.stub.deleteState(serialNumber);
    }
    
    async getAssetStatus(ctx, serialNumber){
    
    	console.info('============= START : Get Asset Status ===========');	
    
    	const assetString = await this.ReadAsset(ctx, serialNumber);
        const asset = JSON.parse(assetString);
        const assetState = asset.State; // get the asset from chaincode state
        
        console.info('============= END : Get Asset Status ===========');	
        
        return assetState.toString();
    	
    }
    
    async queryStolenScooters(ctx) {

        console.info('============= START : Query Stolen Scooters ===========');

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
            if(record.State === 'Stolen'){
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);

        console.info('============= END : Query Stolen Scooters ===========');

        return JSON.stringify(allResults);
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
    
    async createUser(ctx, email, name, password, role){
		
        console.info('============= START : User Registration ===========');

		// Check if the E-Scooter is already present on the ledger
		// Will ensure E-Scooter is not present in either a pending or registered status 
        const exists = await this.UserExists(ctx, email);
        if (exists) {
            throw new Error(`The asset ${email} already exists`);
        }
       
        const user = {
        	ID: email, 
        	Name: name, 
        	Password: password, 
        	Role: role,
        };
        
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(email, Buffer.from(stringify(sortKeysRecursive(user))));

        console.info('============= END : User Registration ===========');

        return JSON.stringify(user);
	}

    async queryUser(ctx, email){
        
        console.info('============= START : Query User ===========');

        const assetJSON = await ctx.stub.getState(email); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${email} does not exist`);
        }

        console.info('============= END : Query User ===========');

        return assetJSON.toString();
    }
    
    async getAllUsers(ctx){
		
		console.info('============= START : Get All Users ===========');

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
            if(record.hasOwnProperty('ID') && record.Role !== 'registrar'){
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);

        console.info('============= END : Get All Users ===========');

        return JSON.stringify(allResults);
	}
	
	async removeParticipant(ctx, ID){
		
		const exists = await this.UserExists(ctx, ID);
        if (!exists) {
            throw new Error(`The asset ${ID} does not exist`);
        }
        return ctx.stub.deleteState(ID);
	}

    async UserExists(ctx, ID) {
        const assetJSON = await ctx.stub.getState(ID);
        return assetJSON && assetJSON.length > 0;
    }


}

module.exports = Scoot;
