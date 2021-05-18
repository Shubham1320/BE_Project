let router = require('express').Router();
let controller = require('./controller');

router.route('/create-asset')
	.post(controller.createAsset);

router.route('/read-asset')
	.post(controller.readAsset);

router.route('/read-asset/private-props')
	.post(controller.readPrivateProps);

router.route('/agree-to-sell')
	.post(controller.agreeToSell);	

module.exports = router;