const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() => {

    try{

        await mongoose.connect( process.env.MONGODB_CNN );

        console.log('MongoDB online');

    }catch(error){

        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');

    }

}

module.exports = {
    dbConnection
}