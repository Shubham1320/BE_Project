let router = require('express').Router();
let controller = require('./controller');

router.route('/create-asset')
	.get(controller.createAsset)
	.post(controller.createAsset);

module.exports = router;