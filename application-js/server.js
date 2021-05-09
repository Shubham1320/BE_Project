let express = require('express');
let apiRoutes = require("./routes");
let bodyParser = require('body-parser');
let morgan = require('morgan');

let app = express();

let dotenv = require('dotenv');
dotenv.config();

let port = process.env.PORT || 8080;

app.listen(port,()=>{
	console.debug('App listening on ' + port);
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(morgan('tiny'));

app.use('/v1', apiRoutes)

