const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect("mongodb+srv://manishgaur7828:omIebRl9YZunjJiS@cluster0.rtskmu9.mongodb.net/text", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(con => {
        console.log(`MongoDB database connected with Host ${con.connection.host}`);
    })
}

module.exports = connectDatabase