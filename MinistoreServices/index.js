const express = require('express');
const cors = require('cors');
const { swaggerSpecs, swaggerUI } = require('./swagger');
const cookieParser = require("cookie-parser");
const apiRouter = require('./routes/api');
const apiv2Router = require('./routes/apiv2');
const https = require('https');
const fs = require('fs');
const app = express();

// express version 4.16.0+ has built-in JSON parsing capabilities
// using below statement for json body parser
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(cookieParser());
app.use('/api/v1', apiRouter);
app.use('/api/v2', apiv2Router);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

const ssl_options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
}
const port = 8800;
const secure_port = 8443;
app.listen(port, () => {
    console.log("Server listening on port:" + port);
});
https.createServer(ssl_options, app).listen(secure_port, () => {
    console.log("HTTPS Server listening on port:" + secure_port);
});