require('dotenv').config();
/** 1) Install & Set up mongoose */
const mongoose = require('mongoose');
// connect mongoose to our database
mongoose.connect(process.env['MONGO_URI'], {useNewUrlParser: true, useUnifiedTopology: true})
//Schema: Structure of the data, user object => user Schema (name, age, birthday...) ---> different file for each Schema
//model: Schema in a usable form, interact with object in the data base
//querry: querry against the database

//everything has an auto generated _id

//create a Schema and pass the object
const Schema = mongoose.Schema;
//object({key:value})
const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

//create the model for that Schema= export.connect("name of the model", "Schema")
const Person = mongoose.model("Person", personSchema);

//create a new object
var createAndSavePerson = function(done) {
  var janeFonda = new Person({name: "Jane Fonda", age: 84, favoriteFoods: ["eggs", "fish", "fresh fruit"]});
//asynchronus function to save the object in the data base
  janeFonda.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  });
};

var arrayOfPeople = [
  {name: "Frankie", age: 74, favoriteFoods: ["Del Taco"]},
  {name: "Sol", age: 76, favoriteFoods: ["roast chicken"]},
  {name: "Robert", age: 78, favoriteFoods: ["wine"]}
];

var createManyPeople = function(arrayOfPeople, done) {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return console.log(err);
    done(null, people);
  });
};


var findPeopleByName = function(personName, done) {
  Person.find({name: personName}, function (err, personFound) {
    if (err) return console.log(err);
    done(null, personFound);
  });
};

var findOneByFood = function(food, done) {
  Person.findOne({favoriteFoods: food}, function (err, data) {
    if (err) return console.log(err);
    done(null, data);
  });
};

var findPersonById = function(personId, done) {
  Person.findById(personId, function (err, data) {
    if (err) return console.log(err);
    done(null, data);
  });
};


const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';

  // .findById() method to find a person by _id with the parameter personId as search key. 
  Person.findById(personId, (err, person) => {
    if(err) return console.log(err); 
  
    // Array.push() method to add "hamburger" to the list of the person's favoriteFoods
    person.favoriteFoods.push(foodToAdd);

    // and inside the find callback - save() the updated Person.
    person.save((err, updatedPerson) => {
      if(err) return console.log(err);
      done(null, updatedPerson)
    })
  })
};


const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
//findOneAndUpdate uses ( conditions , update , options , callback ) 
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, (err, updatedDoc) => {
    if(err) return console.log(err);
    done(null, updatedDoc);
  })
};


const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId,(err, removedDoc)=>{
    if(err) return console.log(err)
    done(null, removedDoc);
  })
  
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  //Pass it to a query document with the name field set, and a callback.
  Person.remove({name: nameToRemove}, (err, response) => {
    if(err) return console.log(err);
    done(null, response);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  
  const findPerson = 
    Person
    .find({favoriteFoods: foodToSearch})
    .sort({name: 1})
    .limit(2)
    .select({age: 0})
    .exec((err, data) => {
      if(!err) {
      done(null, data);
      console.log(`Chained  Successfully. Results: ${data}`)
      } else {
        console.log(err);
      };
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
