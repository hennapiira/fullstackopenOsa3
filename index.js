const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(express.static('dist'));

morgan.token('postData', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :response-time ms - :postData'));
app.use(cors());

let persons = [
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
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (req, res) => {
  const numberOfPersons = persons.length;
  const currentTime = new Date();

  res.send(`
    Phonebook has info for ${numberOfPersons} people<br>
    ${currentTime}
  `);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  return maxId + 1;
};

app.post('/api/persons', (request, response) => {
  const person = {
    id: generateId(),
    name: request.body.name,
    number: request.body.number,
  };

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'Name or number is missing',
    });
  }

  const existingPerson = persons.find(
    (person) => person.name === request.body.name
  );
  if (existingPerson) {
    return response.status(409).json({
      error: 'Name must be unique',
    });
  }

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
