# Bow Course Registration

SODV2201 Assignment 1, 2 and Final Project.

## Frontend

The frontend files are located at `./www` folder, so the next steps assume you are in that folder (`cd www`).

debug the app at [`localhost:9000`](http://localhost:9000)

```sh
# run webpack dev server at localhost:9000
npm run serve
```

Or build the app and deploy to a web server later (this is required to deploy the app to be served by express static files server later):

```sh
npm run build
```

## Backend

### Database

To initialize the SQL Server database, tables, and insert sample data, please execute the database script `db.sql`.

### Environment Variables

Copy the file `.env.sample` into `.env`, if not done already. Edit the file, and insert the configurations:

- `SA_PASSWORD`: the password for sql server `SA` user.
- `DB_HOST`: the host where the sql server receives TCP connections for the database
- `DB_NAME`: the database name, that is `BowCourseReg` in this case.
- `HTTP_PORT`: where express server should be listening. Setting this to 8996 will make the app listen at localhost:8996
- `COOKIES_SECRET`: secret salt for signing authentication cookies

### Deploy

Assuming you have the database server running, and the database initialised, you may start express server next:

```sh
# make sure you are in the root folder
# start the node server
npm start
```

You may use `npm run start-dev` to start with `nodemon` instead, so you can listen for code changes and restart the server when needed.

The app should then be running on [`localhost:8996`](http://localhost:8996), or whatever hostname and port you have used.
