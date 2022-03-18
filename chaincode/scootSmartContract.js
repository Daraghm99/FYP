
'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class scootSmartContract extends Contract {

    async RegisterAsset(ctx, serialNumber, manufacturer, model, colour, owner, status) {
        // Check if the E-Scooter is already present on the ledger
        const exists = await this.AssetExists(ctx, serialNumber);
        if (exists) {
            throw new Error(`The asset ${serialNumber} already exists`);
        }

        const scooter = {
            ID: serialNumber,
            Manufacturer: manufacturer,
            Model: model,
            Colour: colour,
            Owner: owner,
            Status: status,
        };
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(scooter))));
        return JSON.stringify(scooter);
    }

    async GetAllAssets(ctx) {
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
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async ReadAsset(ctx, serialNumber) {
        const assetJSON = await ctx.stub.getState(serialNumber);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${serialNumber} does not exist`);
        }
        return assetJSON.toString();
    }

    async TransferAsset(ctx, serialNumber, newOwnerEmail) {
        const assetString = await this.ReadAsset(ctx, serialNumber);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwnerEmail;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        ctx.stub.putState(serialNumber, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldOwner;
    }
}

module.exports = scootSmartContract;