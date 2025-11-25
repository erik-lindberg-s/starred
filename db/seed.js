const { faker } = require('@faker-js/faker');
const fs = require('fs');
const db = require('./db.js');

function generateUsers(num) {
  const users = [];
  for (let i = 0; i <= num; i++) {
    users.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      salt: faker.lorem.word(),
    })
  }
  return users
}

function reset() {
  const sql = fs.readFileSync(__dirname + '/schema.sql').toString();  
  db.exec(fs.readFileSync(__dirname + '/schema.sql').toString())

  seed()
  console.log('Database has been reset and seeded');
}

function seed() {
  const users = generateUsers(10);
  const stmt = db.prepare("INSERT INTO user (firstName, lastName, email, password, salt) VALUES (?, ?, ?, ?, ?)");
  users.forEach(user => {
    stmt.run(user.firstName, user.lastName, user.email, user.password, user.salt);
  });
  stmt.finalize();

  db.close();
}

reset();
