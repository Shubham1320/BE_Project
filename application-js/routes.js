let router = require('express').Router();
let controller = require('./controller');

router.route('/create-asset')
	.post(controller.createAsset);

router.route('/read-asset')
	.post(controller.readAsset);

router.route('/read-asset/private-props')
	.post(controller.readPrivateProps);

router.route('/read-asset/sale-price')
	.post(controller.readSalePrice);

router.route('/read-asset/bid-price')
	.post(controller.readBidPrice);		

router.route('/get-all-assets')
	.post(controller.getAllAssets);

router.route('/get-asset-history')
	.post(controller.getAssetHistory);		

router.route('/transfer-asset')
	.post(controller.transferAsset);	

router.route('/agree-to-sell')
	.post(controller.agreeToSell);	

router.route('/agree-to-buy')
	.post(controller.agreeToBuy);	

module.exports = router;