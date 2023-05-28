## Service setup

use docker compose -up to have both the db and the service spin up
The service will run on http://localhost:3000 and the db's connection details can be found in the \icf\src\app.module.ts folder, the port is the standard 3306 port.

## Endpoints

## Auth

    - /login

## Artwork

    GET /artwork/:artworkId
    GET /artwork/owner/:id
    GET /artwork?page={foo}?limit={bar}
    POST /artwork/purchase

## Swagger usage:

After spinning up the service navigate to: http://localhost:3000/api
You can find the available endpoints there, also their high level restrictions and structure.

Use the /login endpoint to log into one of the dummy users accounts.
You'll get a working jwt that should be kept alive for 30 minutes.

At the end of the columns of the endpoints UI there is a locket, click that and paste the jwt that is returned to you after logging in.
This should set you up to use the restricted endpoints with Bearer token.

## prod app diffs:

- use env vars
  - build a config service to have consistent env vars
- set up caching for certain endpoint either with redis or in memory with the nestjs common module
- turn off auto entity sync setup
- add a new table to store the artwork
  - add another connection table /user_has_artwork/ that stores the user_id s and the artwork_ids
- add throtling and login attempt checks
- set up a logger service that would log into any 3rd party service
- add health and status endpoint
- set up QA and STG environments with their own db
- implement proper proper interceptors and middleware
