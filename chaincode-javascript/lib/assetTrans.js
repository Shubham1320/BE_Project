/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                ID: 'medicine1',
                MfgDate: '24-01-2020',
                Size: 10,
                Owner: 'Manufacturer',
                AssetValue: 650,
            },
            {
                ID: 'medicine2',
                MfgDate: '10-01-2020',
                Size: 15,
                Owner: 'Manufacturer',
                AssetValue: 400,
            },
            {
                ID: 'medicine3',
                MfgDate: '17-03-2020',
                Size: 17,
                Owner: 'Manufacturer',
                AssetValue: 900,
            },
            {
                ID: 'medicine4',
                MfgDate: '15-06-2020',
                Size: 5,
                Owner: 'Manufacturer',
                AssetValue: 200,
            },
            {
                ID: 'medicine5',
                MfgDate: '21-07-2020',
                Size: 8,
                Owner: 'Manufacturer',
                AssetValue: 800,
            },
            {
                ID: 'medicine6',
                MfgDate: '20-03-2020',
                Size: 11,
                Owner: 'Manufacturer',
                AssetValue: 300,
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.ID} initialized`);
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, objectType, id, owner) {
        
        const transientMap = ctx.stub.getTransient();
        if (!transientMap) {
            throw new Error(`Error getting transient`);
        }

        immutablePropertiesJSON = transientMap["asset_properties"];
        if(!immutablePropertiesJSON) {
            throw new Error(`asset_properties key not found in the transient map`);   
        }

        const cid = new ClientIdentity(ctx.stub);
        const clientOrgID = cid.getMSPID();
        if(!clientOrgID) {
            throw new Error(`Failed to get verified OrgID`);   
        }

        if verifyOrg {
            err = verifyClientOrgMatchesPeerOrg(clientOrgID)
            if err != nil {
                return "", err
            }
        }



        const asset = {
            ObjectType: objectType,
            ID: id,
            MfgDate: mfgDate,
            Size: size,
            Owner: owner,
            AssetValue: assetValue,
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, id, mfgDate, size, owner, assetValue) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            ID: id,
            MfgDate: mfgDate,
            Size: size,
            Owner: owner,
            AssetValue: assetValue,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
    }

    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.Owner = newOwner;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }

    // GetAllAssets returns all assets found in the world state.
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
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }


}

module.exports = AssetTransfer;
