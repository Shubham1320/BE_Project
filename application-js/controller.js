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
			color: 'blue',
			size: 35,
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
		let err = await transaction.submit(assetKey, `Not for sale`);

		res.json({success: true,err: err,salt: salt});
	}	
	catch (error) {
		console.error(error);
	}
}