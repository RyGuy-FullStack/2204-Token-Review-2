# Adventure Away
An API for Guests to log their Vacation destinations

## Getting Started

### Setup

    npm i
    createdb adventure-away
    npm run seed
    npm run start:dev

### View App
Visit [localhost:4000/api/vacations](http://localhost:4000/api/vacations) in your browser

### Force Sync
To drop DB and rebuild completely, creating a cohort named `foo`: 

    SYNC_FORCE_DB=true npm run seed
