require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
let morgan = require('morgan')

app.use(express.json())
app.use(express.static('build'))

// for cross origin access
const cors = require('cors')
app.use(cors())

// logging
// app.use(morgan('tiny'))
morgan.token('body', function (req, res) {
  return (
    JSON.stringify(req.body))
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body '))

// get all
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// show api info
app.get('/info', (request, response) => {
  let count = 0
  Person.countDocuments().exec((err, count) => {
    let line1 = "<div>the phonebook has info for ".concat(count, " people</div><br />")
    let line2 = line1.concat(Date())
    response.send(line2)
  })
})

// get one
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// delete one
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// create one
app.post('/api/persons', (request, response) => {
  console.log(request.body)

  const body = request.body

  let personExists = false
  Person.find().byName(body.name).exec((err, persons) => {
    // console.log(persons.length);
    if (persons.length) {
      personExists = true
    }
  });

  if (body.name === undefined || body.name === "" || body.number === undefined || body.number === "") {
    return response.status(400).json({ error: 'content missing - name and number must be specified' })
  } else if (personExists) {
    return response.status(400).json({ error: 'name already exist in phone book' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// update one
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
