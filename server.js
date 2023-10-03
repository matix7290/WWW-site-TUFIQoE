const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require("express");
const path = require("path");

const app = express();

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/badania-it.tele.agh.edu.pl/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/badania-it.tele.agh.edu.pl/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/badania-it.tele.agh.edu.pl/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// Starting https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.enable('trust proxy')

app.use(function(request, response, next) {
    if (process.env.NODE_ENV != 'development' && !request.secure) {
       return response.redirect("https://" + request.headers.host + request.url);
    }
    next();
})

app.use(express.static('public'))

app.get("/.well-known/acme-challenge/f336ifst627neHC7CTOY7LOAJ9pOA90DARYD5lDwNgI", (req, res) => {
  res.send("f336ifst627neHC7CTOY7LOAJ9pOA90DARYD5lDwNgI.46t8jEJnOkVxR_xcZLK6l781seKfpkYXotXH3gu-9QM")
});

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
});
