const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}


const password = process.argv[2]
const url =
    `mongodb+srv://cyriacusifeanyi:${password}@cluster001.uv8jx.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)




if (process.argv.length === 3) {
    console.log(`phonebook:`)
    // find all
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name}\t${person.number}`)
        })
        mongoose.connection.close()
    })

} else if (process.argv.length === 5) {
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    // creating a new Note object using the constructor(Note model)
    const person = new Person({
        name: newName,
        number: newNumber,
    })

    // // code to save a new object to database
    person.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()
    })

}else{
    console.log(`Please provide the password as an argument: node mongo.js <password> <"new contact name"> <"new number">`)
    process.exit(1)
}

// // Find by important 
// Person.find({ important: false }).then(result => {
//     result.forEach(person => {
//         console.log(person)
//     })
//     mongoose.connection.close()
// })
