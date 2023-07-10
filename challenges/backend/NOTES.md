# How to run

Please create an environment file `.env` in `backend` root folder before running following commands (You will find sample env variables in `.env.sample` file).

Then run `npm start` or for unit tests run `npm test`.

### TODOs & Improvements

**AuctionService.findAllAuctions()**\
I applied paginated fetching assuming that we could have hundreds of auctions.
TODO: Improve auction fetch pagination
Now fetching with pagination is sequential. To make it concurrent, apply following steps:

- fetch only count of all available ACTIVE auctions
- fetch ACTIVE auctions **concurrently** using Promise.all([...fetchers()])

**AuctionService.findRunningAuctions()**\
Instead of fetching all auctions and filter them in memory,
it would be nice to fetch using IAuctionFilter.states params.
Unfortunately I couldn't manage the exact value type from swagger API doc.
I found `IAuctionFilter.states: { undefined	boolean }`, which was
unreadable to me.

**Error handling**\
Introduce some custom Error types.
  
- AuthenticationError
- InvalidDataError etc.
