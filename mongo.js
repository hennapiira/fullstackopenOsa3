const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.4lczcyx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const addPerson = (name, number) => {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

const listPeople = () => {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
      mongoose.connection.close()
    })
  })
}

const argsLength = process.argv.length
if (argsLength === 3) {
  listPeople()
} else if (argsLength === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  addPerson(name, number)
} else {
  console.log(
    'Please provide the correct number of arguments: node mongo.js <password> <name> <number>'
  )
  mongoose.connection.close()
  process.exit(1)
}
