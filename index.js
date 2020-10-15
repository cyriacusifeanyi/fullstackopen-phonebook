const express = require('express')
const app = express()
var morgan = require('morgan')

app.use(express.json())

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

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

// get all
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// show api info
app.get('/info', (request, response) => {

  let line1 = "<div>the phonebook has info for ".concat(persons.length, " people</div><br />")
  let line2 = line1.concat(Date())
  response.send(line2)
})

// get one
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// delete one
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// create one
app.post('/api/persons', (request, response) => {
  const body = request.body
  const personExists = persons.find(person => person.name === body.name)

  if (!body.name || !body.number) {
    return response.status(404).json(
      {
        error: 'name and number must be specified'
      }
    )
  } else if (personExists) {
    return response.status(409).json({error: 'name already exist in phone book'})
  }

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

  const personObject = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(personObject)

  response.json(personObject)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

