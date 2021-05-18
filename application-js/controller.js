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

exports.agreeToSell = async function(req,res) {

	let channelName = req.body.channelName;
	let chaincodeName = req.body.chaincodeName;
	let organization = req.body.organization;
	let orgUserId = req.body.orgUserId;
	let assetKey = req.body.assetKey;
	let msp = req.body.msp;

	try {
		let gateway = await createGateway(organization,orgUserId);
		let network = await gateway.getNetwork(channelName);
		let contract = network.getContract(chaincodeName);
		console.log("Connected to organization peer");

		let transaction1 = contract.createTransaction('ChangePublicDescription');
		transaction1.setEndorsingOrganizations(msp);
		await transaction1.submit(assetKey, `Up for sale`);

		

	}	
	catch (error) {
		console.error(error);
		res.json({success: false,error: error});
	}

}

