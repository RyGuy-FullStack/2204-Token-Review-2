# Adventure Away
An API for Guests to log their Vacation destinations

## Getting Started

### Setup

    npm i
    createdb adventure-away
    npm run seed
    npm run start:dev

### View App
Visit [localhost:4000/api/2105-SJS-RM-WEB-PT/vacations](http://localhost:4000/api/2105-SJS-RM-WEB-PT/vacations) in your browser

### Read the Docs
The [docs](api_docs.md) list available routes and resources

### Force Sync
To drop DB and rebuild completely, creating a cohort named `foo`: 

    SYNC_FORCE_DB=true npm run seed
