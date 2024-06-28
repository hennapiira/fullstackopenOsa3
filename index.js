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

app.get('/api/people', (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.json(people);
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const currentTime = new Date();
      response.send(`Phonebook has info for ${count} people<br>${currentTime}
      `);
    })
    .catch((error) => next(error));
});

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.delete('/api/people/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

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
