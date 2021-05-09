const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
const { buildCCP, buildWallet } = require('./AppUtil.js');


async function init(organization,msp,userId) {

	const ccpOrg = buildCCP(organization);

	const caOrgClient = buildCAClient(FabricCAServices, ccpOrg, 'ca.' + organization +'.example.com');

	const walletPath = path.join(__dirname, 'wallet', organization);
	const wallet = await buildWallet(Wallets, walletPath);

	await enrollAdmin(caOrgClient, wallet, msp);

	await registerAndEnrollUser(caOrgClient, wallet, msp, userId);
}

async function main() {
	
		try {
			
			await init('manufacturer','ManufacturerMSP','manufacturerUser1');
			await init('retailer','RetailerMSP','retailerUser1');
			await init('distributor','DistributorMSP','distributorUser1');

		} catch (error) {
		console.error(`Error in setup: ${error}`);
		if (error.stack) {
			console.error(error.stack);
		}
		process.exit(1);
	}
		
}
main();
