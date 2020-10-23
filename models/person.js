const mongoose = require('mongoose')
let uniqueValidator = require('mongoose-unique-validator');


// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => console.log('connected to MongoDB'))
    .catch((error) => console.log('error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minlength: 3
    },
    number: {
        type: String,
        minlength: 8
    },
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

personSchema.query.byName = function (name) {
    return this.where({ name: new RegExp(name, 'i') })
};

module.exports = mongoose.model('Person', personSchema)