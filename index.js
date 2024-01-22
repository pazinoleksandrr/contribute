const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
require('./dbInit');

const app = express();
app.use(bodyParser.json());

const MODE = process.env.DEPLOY_MODE;
if (MODE === 'production') {
	app.use(cors({
		origin: [
			process.env.CLIENT_ORIGIN,
			'https://cronos-slots.web.app',
			'https://cronos-roulette.firebaseapp.com',
			'https://cronos-coin.web.app',
			'https://cronos-blackjack.web.app',
		]
	}));
} else {
	app.use(cors());
}

require('./router')(app)

process.on('uncaughtException', err => {});
let PORT;
const socketServerOptions = {
	cors: true,
	origins: [ process.env.CLIENT_ORIGIN ],
}

if (MODE === 'development') {
	PORT = 8080;
	const server = http.createServer(app);
	const io = require('./socketServer')(server, socketServerOptions);
	app.set('io', io);

	server.listen(PORT, () => {
		console.log(`Server is listening at port ${PORT}`);
	});
} else {
	PORT = process.env.PORT;
	const httpsServer = https.createServer({
		key: fs.readFileSync('./private.key'),
		cert: fs.readFileSync('./cert.crt'),
		ca: [
			fs.readFileSync('./ca.crt'),
		]
	}, app);

	
	const io = require('./socketServer')(httpsServer, socketServerOptions);
	app.set('io', io);

	httpsServer.listen(PORT, () => {
		console.log(`HTTPS Server running on port ${PORT}`);
	});
}