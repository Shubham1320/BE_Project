const { Gateway, Wallets } = require('fabric-network');
const { buildCCP, buildWallet } = require('./AppUtil.js');
const path = require('path');
const crypto = require('crypto');

async function createGateway(organization,orgUserId) {
	const ccpOrg = buildCCP(organization);

	try {
		
		const gateway = new Gateway();
		
		const walletPath = path.join(__dirname, 'wallet', organization);
		const wallet = await buildWallet(Wallets, walletPath);

		await gateway.connect(ccpOrg,
			{ wallet: wallet, identity: orgUserId, discovery: { enabled: true, asLocalhost: true } });

		return gateway;
	} catch (error) {
		console.error(`Error in connecting to gateway for Org1: ${error}`);
	}

}

exports.readAsset = async function(req,res) {

	let channelName = req.body.channelName;
	let chaincodeName = req.body.chaincodeName;
	let assetKey = req.body.assetKey;
	let organization = req.body.organization;
	let orgUserId = req.body.orgUserId;

	try {
		let gateway = await createGateway(organization,orgUserId);
		let network = await gateway.getNetwork(channelName);
		let contract = network.getContract(chaincodeName);
		console.log("Connected to organization peer");

		let result = await contract.evaluateTransaction('ReadAsset', assetKey);
		let asset = JSON.parse(result.toString('utf8'));

		res.json({success: true,result: asset});

	}	
	catch (error) {
		console.error(error);
		res.json({success: false,error: error});
	}

}

exports.getAllAssets = async function(req,res) {

	let channelName = req.body.channelName;
	let chaincodeName = req.body.chaincodeName;
	let organization = req.body.organization;
	let orgUserId = req.body.orgUserId;

	try {
		let gateway = await createGateway(organization,orgUserId);
		let network = await gateway.getNetwork(channelName);
		let contract = network.getContract(chaincodeName);
		console.log("Connected to organization peer");

		let result = await contract.evaluateTransaction('GetAllAssets');


		let asset = JSON.parse(result.toString('utf8'));

		res.json({success: true,result: asset});

	}	
	catch (error) {
		console.error(error);
		res.json({success: false,error: error});
	}

}

exports.getAssetHistory = async function(req,res) {

	let channelName = req.body.channelName;
	let chaincodeName = req.body.chaincodeName;
	let assetKey = req.body.assetKey;
	let organization = req.body.organization;
	let orgUserId = req.body.orgUserId;

	try {
		let gateway = await createGateway(organization,orgUserId);
		let network = await gateway.getNetwork(channelName);
		let contract = network.getContract(chaincodeName);
		console.log("Connected to organization peer");

		let result = await contract.evaluateTransaction('QueryAssetHistory', assetKey);
		let asset = JSON.parse(result.toString('utf8'));

		res.json({success: true,result: asset});

	}	
	catch (error) {
		console.error(error);
		res.json({success: false,error: error});
	}

}

exports.readPrivateProps = async function(req,res) {
	let channelName = req.body.channelName;
	let chaincodeName = req.body.chaincodeName;
	let organization = req.body.organization;
	let orgUserId = req.body.orgUserId;
	let assetKey = req.body.assetKey;

	try {
		let gateway = await createGateway(organization,orgUserId);
		let network = await gateway.getNetwork(channelName);
		let contract = network.getContract(chaincodeName);
		console.log("Connected to organization peer");

		const result= await contract.evaluateTransaction('GetAssetPrivateProperties', assetKey);
		const asset = JSON.parse(result.toString('utf8'));
		res.json({success: true,result: asset});

	}	
	catch (error) {
		console.error(error);
		res.json({success: false,error: error});
	}
}

exports.readSalePrice = async function(req,res) {
	let channelName = req.body.channelName;
	let chaincodeName = req.body.chaincodeName;
	let organization = req.body.organization;
	let orgUserId = req.body.orgUserId;
	let assetKey = req.body.assetKey;

	try {
		let gateway = await createGateway(organization,orgUserId);
		let network = await gateway.getNetwork(channelName);
		let contract = network.getContract(chaincodeName);
		console.log("Connected to organization peer");

		const result= await contract.evaluateTransaction('GetAssetSalesPrice', assetKey);
		const asset_price = JSON.parse(result.toString('utf8'));
		res.json({success: true,result: asset_price});

	}	
	catch (error) {
		console.error(error);
		res.json({success: false,error: error});
	}
}

exports.readBidPrice = async function(req,res) {
	let channelName = req.body.channelName;
	let chaincodeName = req.body.chaincodeName;
	let organization = req.body.organization;
	let orgUserId = req.body.orgUserId;
	let assetKey = req.body.assetKey;

	try {
		let gateway = await createGateway(organization,orgUserId);
		let network = await gateway.getNetwork(channelName);
		let contract = network.getContract(chaincodeName);
		console.log("Connected to organization peer");

		const result= await contract.evaluateTransaction('GetAssetBidPrice', assetKey);
		const asset_price = JSON.parse(result.toString('utf8'));
		res.json({success: true,result: asset_price});

	}	
	catch (error) {
		console.error(error);
		res.json({success: false,error: error});
	}
}

exports.createAsset = async function(req, res) {
	console.log(req.body);

	let channelName = req.body.channelName;
	let chaincodeName = req.body.chaincodeName;
	let organization = req.body.organization;
	let orgUserId = req.body.orgUserId;
	let msp = req.body.msp;

	let assetKey = req.body.assetKey;
	let assetName = req.body.assetName;
	let manufacturingDate = req.body.manufacturingDate;
	let expiryDate = req.body.expiryDate;
	let size = req.body.size;

	try {
		let gateway = await createGateway(organization,orgUserId);
		let network = await gateway.getNetwork(channelName);
		let contract = network.getContract(chaincodeName);
		console.log("Connected to organization peer");

		//const randomNumber = Math.floor(Math.random() * 100) + 1;
		//let salt = Buffer.from(randomNumber.toString()).toString('hex');

		let salt = crypto.randomBytes(32).toString('base64'); 

		let asset_properties = {
			object_type: 'asset_properties',
			asset_id: assetKey,
			assetName: assetName,
			manufacturingDate: manufacturingDate,
			expiryDate: expiryDate,
			size: size,
			salt: salt
		};
		
		let asset_properties_string = JSON.stringify(asset_properties);
		let encoded_string = Buffer.from(asset_properties_string).toString("base64");
		console.log(encoded_string);

		transaction = contract.createTransaction('CreateAsset');
		transaction.setEndorsingOrganizations(msp);
		transaction.setTransient({
			asset_properties: encoded_string
		});
		await transaction.submit(assetKey, `Not for sale`);

		res.json({success: true,salt: salt});
		

	}	
	catch (error) {
		console.error(error);
		res.json({success: false,error: error});
	}
}

exports.agreeToSell = async function(req,res) {

	let channelName = req.body.channelName;
	let chaincodeName = req.body.chaincodeName;
	let organization = req.body.organization;
	let orgUserId = req.body.orgUserId;
	let assetKey = req.body.assetKey;
	let msp = req.body.msp;
	let price = parseInt(req.body.price);

	try {
		let gateway = await createGateway(organization,orgUserId);
		let network = await gateway.getNetwork(channelName);
		let contract = network.getContract(chaincodeName);
		console.log("Connected to organization peer");

		let transaction1 = contract.createTransaction('ChangePublicDescription');
		transaction1.setEndorsingOrganizations(msp);
		await transaction1.submit(assetKey, `Up for sale`);


		let salt = crypto.randomBytes(32).toString('base64'); 

		const asset_price = {
			asset_id: assetKey,
			price: price,
			trade_id: salt
		};

		let asset_price_string = JSON.stringify(asset_price);
		let encoded_string = Buffer.from(asset_price_string).toString("base64");
		console.log(encoded_string);

		transaction2 = contract.createTransaction('AgreeToSell');
		transaction2.setEndorsingOrganizations(msp);
				
		transaction2.setTransient({
			asset_price: encoded_string
		});
				
		await transaction2.submit(assetKey);

		res.json({success: true,trade_id: salt});

	}	
	catch (error) {
		console.error(error);
		res.json({success: false,error: error});
	}

}

exports.agreeToBuy = async function(req,res) {

	let channelName = req.body.channelName;
	let chaincodeName = req.body.chaincodeName;
	let organization = req.body.organization;
	let orgUserId = req.body.orgUserId;
	
	let assetKey = req.body.assetKey;
	let assetName = req.body.assetName;
	let manufacturingDate = req.body.manufacturingDate;
	let expiryDate = req.body.expiryDate;
	let size = req.body.size;
	let salt = req.body.salt;
	let price = parseInt(req.body.price);
	let tradeSalt = req.body.tradeSalt;
	let msp = req.body.msp;

	try {
		let gateway = await createGateway(organization,orgUserId);
		let network = await gateway.getNetwork(channelName);
		let contract = network.getContract(chaincodeName);
		console.log("Connected to organization peer");

		let asset_properties = {
			object_type: 'asset_properties',
			asset_id: assetKey,
			assetName: assetName,
			manufacturingDate: manufacturingDate,
			expiryDate: expiryDate,
			size: size,
			salt: salt
		};
		
		let asset_properties_string = JSON.stringify(asset_properties);
		let encoded_string = Buffer.from(asset_properties_string).toString("base64");
		console.log(encoded_string);

		transaction1 = contract.createTransaction('VerifyAssetProperties');
		transaction1.setTransient({
			asset_properties: encoded_string
		});
		
		let verifyResultBuffer = await transaction1.evaluate(assetKey);
				
		if (verifyResultBuffer) {
			let verifyResult = Boolean(verifyResultBuffer.toString());
					
			if (!verifyResult) {
				res.json({success: false,error: "Verification Failed"});				
			}

		} else {
			res.json({success: false,error: "Verification Failed"});
		}
		
		const asset_price = {
			asset_id: assetKey,
			price: price,
			trade_id: tradeSalt
		};

		let asset_price_string = JSON.stringify(asset_price);
		let encoded_price_string = Buffer.from(asset_price_string).toString("base64");
		console.log(encoded_price_string);

		transaction2 = contract.createTransaction('AgreeToBuy');
		transaction2.setEndorsingOrganizations(msp);
				
		transaction2.setTransient({
			asset_price: encoded_price_string
		});
				
		await transaction2.submit(assetKey);

		res.json({success: true});

	}	
	catch (error) {
		console.error(error);
		res.json({success: false,error: error});
	}

}

exports.transferAsset = async function(req,res) {

	let channelName = req.body.channelName;
	let chaincodeName = req.body.chaincodeName;
	let organization = req.body.organization;
	let orgUserId = req.body.orgUserId;
	
	let assetKey = req.body.assetKey;
	let assetName = req.body.assetName;
	let manufacturingDate = req.body.manufacturingDate;
	let expiryDate = req.body.expiryDate;
	let size = req.body.size;
	let salt = req.body.salt;
	let price = parseInt(req.body.price);

	let tradeSalt = req.body.tradeSalt;
	
	let msp1 = req.body.msp1;
	let msp2 = req.body.msp2

	try {
		let gateway = await createGateway(organization,orgUserId);
		let network = await gateway.getNetwork(channelName);
		let contract = network.getContract(chaincodeName);
		console.log("Connected to organization peer");

		let asset_properties = {
			object_type: 'asset_properties',
			asset_id: assetKey,
			assetName: assetName,
			manufacturingDate: manufacturingDate,
			expiryDate: expiryDate,
			size: size,
			salt: salt
		};
		
		let asset_properties_string = JSON.stringify(asset_properties);
		let encoded_string = Buffer.from(asset_properties_string).toString("base64");
		console.log(encoded_string);
		
		const asset_price = {
			asset_id: assetKey,
			price: price,
			trade_id: tradeSalt
		};

		let asset_price_string = JSON.stringify(asset_price);
		let encoded_price_string = Buffer.from(asset_price_string).toString("base64");
		console.log(encoded_price_string);

		transaction = contract.createTransaction('TransferAsset');
		transaction.setEndorsingOrganizations(msp1, msp2);
		transaction.setTransient({
			asset_properties: encoded_string,
			asset_price: encoded_price_string
		});
		
		await transaction.submit(assetKey, msp2);
		
		res.json({success: true});

	}	
	catch (error) {
		console.error(error);
		res.json({success: false,error: error});
	}

}





