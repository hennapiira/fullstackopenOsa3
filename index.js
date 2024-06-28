const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(express.static('dist'));

morgan.token('postData', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :response-time ms - :postData'));
app.use(cors());

const Person = require('./models/person');
/*let people = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];*/

app.get('/api/people', (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.json(people);
    })
    .catch((error) => next(error));
});

/*app.get('/info', (req, res) => {
  const numberOfPeople = people.length;
  const currentTime = new Date();

  res.send(`
    Phonebook has info for ${numberOfPeople} people<br>
    ${currentTime}
  `);
});

app.get('/api/people/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = people.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});*/

app.delete('/api/people/:id', (request, response, next) => {
  console.log(request.params.id);
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

/*const generateId = () => {
  const maxId =
    people.length > 0 ? Math.max(...people.map((n) => Number(n.id))) : 0;
  return maxId + 1;
};*/

app.post('/api/people', (request, response, next) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'Name or number is missing',
    });
  }

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
