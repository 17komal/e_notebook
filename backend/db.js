
const mongoose = require('mongoose');

// const mongooseUrl = "mongodb://localhost:27017/";
const mongooseUrl = "mongodb+srv://komal_react:DUWL4r9vWZ8yuz3O@cluster0.5xnc5ch.mongodb.net/";
// // const mongooseUrl = "mongodb://root:root@localhost:27017/?directConnection=true&authMechanism=DEFAULT&tls=false";
const connetToMongo = () =>{
    mongoose.connect(mongooseUrl);
    console.log('conneted to mongo DB')
}



module.exports = connetToMongo;