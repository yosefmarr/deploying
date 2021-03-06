const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const serverConfig = require('./configs/server-config');
const filesConfig = require('./configs/files-config');

//const mongoConnect = require('./services/mongodb/mongodb').mongoConnect;
const firebaseConnect = require('./services/firebase/firebase').firebaseConnect;

const productRoutes = require('./routes/product');

const app = express();

app.use(express.static(path.join(__dirname, '/client/build/')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(multer({storage: filesConfig.fileStorage, fileFilter: filesConfig.fileFilter}).single('image'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTION, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/product', productRoutes);

firebaseConnect();

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
});


app.listen(serverConfig.port, () => { 
    console.log(`Server running at ${serverConfig.port}`);
});

/*
mongoConnect(() => {
    app.listen(serverConfig.port, serverConfig.ip, () => { 
        console.log(`Server running at ${serverConfig.server}:${serverConfig.port}`);
    });
});*/