const express = require('express');
const fs = require('fs');
const https = require('https');
const forge = require('node-forge');

const app = express();
const port = 3000;

const opts = {
	key: fs.readFileSync(__dirname +  "/certs/server_key.pem"),
	cert: fs.readFileSync(__dirname +  "/certs/server_cert.pem"),
	requestCert: true,
	rejectUnauthorized: false,
	ca: [ fs.readFileSync(__dirname +  "/certs/ca_cert.pem") ]
}

app.get('/mysales', (req, res) => {
	const user = getUserFromRequest(req);
	if (! user) {
		res.status(401).type('json').send({error: "You are not logged in!"});
		return;
	}

	const salesData = getSalesDataForUser(user);
	if (! salesData) {
		res.status(403).type('json').send({user: user, error: "You are not a registered salesperson!"});
		return;
	}

	res.status(200).type('json').send(salesData);
});

https.createServer(opts, app).listen(port, () => console.log(`Sales reporter listening on port ${port}!`));

function getSalesDataForUser(user) {
	const salesData = JSON.parse(fs.readFileSync(__dirname + "/sales.json", "utf-8"));

	return salesData.find(salesDataElement => {
		return salesDataElement.user === user;
	});
}

function getUserFromRequest(req) {
	const userCertHeader = req.header("SSL_CLIENT_CERT");
	if (! userCertHeader) {
		console.log(`no ssl_client_cert header`);
		return undefined;
	}

	const cert = certFromDer(userCertHeader);
	console.log(`decoded cert is ${cert}`);
	return cert.subject.getField("CN").value;
}

function certFromDer(der) {
	var derKey = forge.util.decode64(der);
	var asnObj = forge.asn1.fromDer(derKey);
	return forge.pki.certificateFromAsn1(asnObj);
}