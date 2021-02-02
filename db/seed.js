'use strict'

const db = require('./index');
const {Vacation} = require('./models');

const vacationsData = [
  {
    location: 'Paris',
    description: 'everyone wants to go here',
  },
  {
    location: 'Salt Flats, Bolivia',
    description: 'This blindingly white landscape in central Bolivia really is salt.',
  },
  {
    location: 'Chocolate hills, Philippines',
    description: 'Alas, this is not a Willy Wonka paradise. The name comes from the brown color of the mounds in the winter. ',
  },
  {
    location: 'Simpson Desert, Australia',
    description: 'Sand that swirls through the 54,000-square-mile desert is a blood red. This is a dunal desert, with linear dunes that can be 125 miles long and as tall as 23 miles.',
  },
  {
    location: "Giant's Causeway, Ireland",
    description: "Hexagonal stones that stacked along the water like the world's largest Qbert set. There are almost 40,000 of the ballast columns, formed 60 million years ago by magma that spewed and cooled along the coast.",
  },
  {
    location: "The Hand in the Desert, Chile",
    description: "A huge unnerving sculpture of a hand rising out of the sand in the middle of Chile’s Atacama desert, 46 miles south of the city of Antofagasta",
  },
];


async function seed() {
  await db.sync({force: true});
  console.log('db synced!');

  for (const vacation of vacationsData) {
    await Vacation.create(vacation);
  }
  console.log(`seeded ${vacationsData.length} vacations`);

  console.log(`seeded successfully`);
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes
module.exports = seed;
