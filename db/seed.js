'use strict'

const db = require('./index');
const { Vacation, Guest, Cohort, Comment } = require('./models');
const { SYNC_FORCE_DB = false } = process.env;

const vacationsData = [
  {
    location: 'Paris',
    description: 'everyone wants to go here',
    guestId: 1
  },
  {
    location: 'Salt Flats, Bolivia',
    description: 'This blindingly white landscape in central Bolivia really is salt.',
    guestId: 2
  },
  {
    location: 'Chocolate hills, Philippines',
    description: 'Alas, this is not a Willy Wonka paradise. The username comes from the brown color of the mounds in the winter. ',
    guestId: 3
  },
  {
    location: 'Simpson Desert, Australia',
    description: 'Sand that swirls through the 54,000-square-mile desert is a blood red. This is a dunal desert, with linear dunes that can be 125 miles long and as tall as 23 miles.',
    guestId: 1
  },
  {
    location: "Giant's Causeway, Ireland",
    description: "Hexagonal stones that stacked along the water like the world's largest Qbert set. There are almost 40,000 of the ballast columns, formed 60 million years ago by magma that spewed and cooled along the coast.",
    guestId: 2
  },
  {
    location: "The Hand in the Desert, Chile",
    description: "A huge unnerving sculpture of a hand rising out of the sand in the middle of Chile’s Atacama desert, 46 miles south of the city of Antofagasta",
    guestId: 3
  },
];

const guestsData = [
  {
    username: 'buster',
    password: 'vacationsorbust',
    email: 'buster@example.com',
  },
  {
    username: 'sally',
    password: 'sillysailing',
    email: 'sally@example.com',
  },
  {
    username: 'charles',
    password: 'chuckwagon',
    email: 'charles@example.com',
  },
];

const commentsData = [
  {
    content: 'everyone (including me) totally DOES want to go here',
    guestId: 1,
    vacationId: 1
  },
  {
    content: 'Thats some salt, man!',
    guestId: 2,
    vacationId: 2
  },
  {
    content: 'Bummer theres no real chocolate.',
    guestId: 3,
    vacationId: 3
  },
  {
    content: 'Oh lala! Paris!',
    guestId: 1,
    vacationId: 1
  },
  {
    content: "Is the salt edible?",
    guestId: 2,
    vacationId: 2
  },
  {
    content: "Interesting that it's brown in the winter...",
    guestId: 3,
    vacationId: 3
  },
];


async function seed(cohortIdStr = 'foo') {
  if (SYNC_FORCE_DB === 'true') {
    await db.sync({force: true});
    console.log(`>>>> DROPPING DB. { force: true } <<<<`);
  }
  console.log('db synced!');

  const cohort = await Cohort.create({ name: cohortIdStr });
  const cohortId = cohort.id;

  // guests
  for (const guest of guestsData) {
    await Guest.create({...guest, cohortId});
  }
  console.log(`seeded ${guestsData.length} guests`);

  // vacations
  for (const vacation of vacationsData) {
    await Vacation.create({...vacation, cohortId});
  }
  console.log(`seeded ${vacationsData.length} vacations`);

  // comments
  for (const comment of commentsData) {
    await Comment.create({...comment, cohortId});
  }
  console.log(`seeded ${commentsData.length} comments`);

  console.log(`seeded successfully`);
  return cohort;
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
