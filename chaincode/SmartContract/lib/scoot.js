

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class Scoot extends Contract {

    async requestAssetRegistration(ctx, serialNumber, manufacturer, model, owner, retailer){

		// Check if the E-Scooter is already present on the ledger
		// Will ensure E-Scooter is not present in either a pending or registered status 
        const exists = await this.AssetExists(ctx, serialNumber);
        if (exists) {
            return JSON.stringify('Asset Exists');
        }
       
        // Include a Status of Pending as a Retailer must Approve
        // State is set to Active on initial Request 
        const scooter = {
        	SerialNumber: serialNumber, 
        	Manufacturer: manufacturer, 
        	Model: model, 
        	Owner: owner,
        	Retailer: retailer,
        	Status: 'Pending',
        	State: 'Active',
        };
        
        // Store the Request in the ledger
        await ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(scooter))));

        return JSON.stringify(scooter);
	}
	
	async createAsset(ctx, serialNumber, manufacturer, model, owner, retailer){
		
		// Check if the E-Scooter is already present on the ledger
		// Will ensure E-Scooter is not present in either a pending or registered status 
        const exists = await this.AssetExists(ctx, serialNumber);
        if (exists) {
            return JSON.stringify('Asset Exists');
        }

        // Check if the owner input exists on the network
        const uexists = await this.UserExists(ctx, owner);
        if(!uexists){
            return JSON.stringify('User Not Found');
        }

        // Check the role of the owner
        const assetJSON = await ctx.stub.getState(owner);
        const asset = JSON.parse(assetJSON);
        if(asset.Role !== 'owner'){
            return JSON.stringify('User Role Error');
        }

        // E-Scooter will have a Status of Registered
        const scooter = {
        	SerialNumber: serialNumber, 
        	Manufacturer: manufacturer, 
        	Model: model, 
        	Owner: owner,
        	Retailer: retailer,
        	Status: 'Registered',
        	State: 'Active',
        };
        
        await ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(scooter))));

        return JSON.stringify(scooter);
	}
	
	async createAssetService(ctx, SID, serialNumber, serviceType, serviceDate, serviceDescription){
		
        // Ensure the E-Scooter that the service is being applied to exists
		const exists = await this.AssetExists(ctx, serialNumber);
        if (!exists) {
            return JSON.stringify('E-Scooter Not Found');
        }
		
		const service = {
			SID: SID,
			SerialNumber: serialNumber,
			ServiceType: serviceType,
			ServiceDate: serviceDate,
			ServiceDescription: serviceDescription,
		};
		
		await ctx.stub.putState(SID, Buffer.from(stringify(sortKeysRecursive(service))));
		
		return JSON.stringify(service);	
	}
	
	async queryAssetServiceHistory(ctx, serialNumber){
		
        // Ensure the E-Scooter exists
		const exists = await this.AssetExists(ctx, serialNumber);
        if (!exists) {
            return JSON.stringify('Not Found');
        }
        
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            // Retrieve all Service records for the serial number passed in
            if(record.hasOwnProperty('ServiceDescription') && record.SerialNumber === serialNumber){
                allResults.push(record);
            }
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
	}
	
	async queryAssetHistory(ctx, serialNumber){
		
		const exists = await this.AssetExists(ctx, serialNumber);
        if (!exists) {
            //throw new Error(`The asset ${serialNumber} already exists`);
            return JSON.stringify('E-Scooter Not Found');
        }
		
		let iterator = await ctx.stub.getHistoryForKey(serialNumber);
    	let result = [];
    	let res = await iterator.next();
    	
    	while (!res.done) {
      		if (res.value) {
        		const obj = JSON.parse(res.value.value.toString('utf8'));
        		obj.TxId = res.value.txId;
                obj.Timestamp = res.value.timestamp;
                obj.Timestamp = new Date((res.value.timestamp.seconds.low * 1000));
                obj.Certificate = res.value.X509Certificate;
        		result.push(obj);
      		}
      		res = await iterator.next();
    	}
    	await iterator.close();
    	return JSON.stringify(result);
	}

    async queryMyAssets(ctx, owner) {

        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            // Retrieve all Records for the owner passed in 
            if(record.Owner === owner && record.Status === 'Registered'){
                allResults.push(record);
            }
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async queryMyRequests(ctx, retailer) {

        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            // Retrieve all Pending application requests for the retailer
            if(record.Retailer === retailer && record.Status === 'Pending'){
                allResults.push(record);
            }
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
    
    async transferAsset(ctx, serialNumber, newOwner){
        
        // Check if user exists
        const exists = await this.UserExists(ctx, newOwner);
        if(!exists){
        	return JSON.stringify('User Error');
        }

        // If the E-Scooter exists then retrieve the Asset
        const assetString = await this.ReadAsset(ctx, serialNumber);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        
        // Ensure a user cannot transfer to themselves
        if(oldOwner === newOwner){
        	return JSON.stringify('Self Transfer');
        }
        
        asset.Owner = newOwner;
        
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(asset))));
        
        return JSON.stringify('Asset Transferred');
    }

    async markAssetStolen(ctx, serialNumber){
    	
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
        
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }
    
    async approveAssetRegistration(ctx, serialNumber){
    	
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
    	
    	const exists = await this.AssetExists(ctx, serialNumber);
        if (!exists) {
            return JSON.stringify('Asset Not Found');
        }
    
    	const assetString = await this.ReadAsset(ctx, serialNumber);
        const asset = JSON.parse(assetString);
        const assetState = asset.State; 
        
        return JSON.stringify(assetState);
    }
    
    async queryStolenScooters(ctx) {

        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            // Retrieve all Pending application requests for the retailer
            if(record.State === 'Stolen'){
                allResults.push(record);
            }
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

	async ReadAsset(ctx, serialNumber) {
        const assetJSON = await ctx.stub.getState(serialNumber); 
        if (!assetJSON || assetJSON.length === 0) {
            return JSON.stringify('E-Scooter Not Found');
        }
        return assetJSON.toString();
    }

    async AssetExists(ctx, serialNumber) {
        const assetJSON = await ctx.stub.getState(serialNumber);
        return assetJSON && assetJSON.length > 0;
    }
    
    async createUser(ctx, email, name, password, role){

        // Check if the participant is already present on the ledger
        const exists = await this.UserExists(ctx, email);
        if (exists) {
            return JSON.stringify('User Exists');
        }
        
        // Check if any retailer wth the same name exists
        if(role === 'retailer'){
        	const rexists = await this.RetailerExists(ctx, name);
        	
        	if (rexists) {
        		return JSON.stringify('Retailer Exists');
        	}
        }
       
        const user = {
        	ID: email, 
        	Name: name, 
        	Password: password, 
        	Role: role,
        };
        
        await ctx.stub.putState(email, Buffer.from(stringify(sortKeysRecursive(user))));

        return JSON.stringify(user);
	}

    async queryUser(ctx, email){

        const assetJSON = await ctx.stub.getState(email); 
        if (!assetJSON || assetJSON.length === 0) {
            return JSON.stringify('User Not Found');
        }

        return assetJSON.toString();
    }
    
    async getAllUsers(ctx){

        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            // Retrieve all Pending Users in the ledger that dont have a role of registrar
            if(record.hasOwnProperty('ID') && record.Role !== 'registrar'){
                allResults.push(record);
            }
            result = await iterator.next();
        }
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

    async RetailerExists(ctx, Name) {
        
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            // Return True if a Retailer exists with the same Name passed in
            if(record.hasOwnProperty('ID') && record.Name === Name){
                return true
            }
            result = await iterator.next();
        }
        return false
    }

}

module.exports = Scoot;
