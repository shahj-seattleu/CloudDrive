# CloudDrive

## File Structure

```
nodejs-team/
 ├──config/                      * our configuration
 |   ├──config.json              * mysql database configuration
 |   ├──migrations/              * sequelize migration for creating ORM
 │
 ├──models/                      * creating tables and connecting to database
 │   │
 ├──routes/                      * access points for all the routes for the application
 │   │   ├──drive-route.js       * Routers for List , Delete , Add , Download and Move
 ├──sequelize-models/            * Logic for all the Database and validations
 │   │   ├──drive-sequelize.js   * Methods to fetch records from database and run queries for List , Delete , Add , Download and Move    
 │
 ├──bower.json                   * what npm uses to manage it's bootstrap dependencies
 ├──package.json                 * what npm uses to manage it's dependencies
 └──app.js                       * express framework,router , body parser middleware functions  

```

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. The Node.js package ecosystem, npm, is the largest ecosystem of open source libraries in the world.

# Getting Started
## Dependencies
What you need to run this app:
* `node` and `npm` (`brew install node`)
* Ensure you're running the latest versions Node `v8.7.x`+ (or `v7.10.1`) and NPM `5.x.x`+


## Installing on MacOSX
The preferred method for installing Node.js, is to use the versions available in package managers, such as apt-get, Macports

## Using MacPorts
* `MacPorts` (http://www.macports.org/) has for years been packaging a long list of open source software packages for Mac OS X

```bash
sudo port search nodejs npm
sudo port install nodejs npm
which node
node --version
```

## Using Homebrew
```bash
brew search node
brew install node
```
## Installing the Node.js distribution from nodejs.org
* The https://nodejs.org/en/ website offers built-in binaries for Windows, Mac OS X, Linux, and Solaris
* We can simply go to the website, click on the install button, and run the installer


## Installing
* `npm install` to install all dependencies

## Running the app
After you have installed all dependencies you can now run the app. Run `npm start` to start a local server using  which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://127.0.0.1:3000` (or if you prefer IPv6, if you're using `express` server, then it's `http://[::1]:3000/`).


## Other commands
### build database migrations
```bash
# development
start mysql server using command prompt or mysql workbench at 127.0.0.1:3306
create a schema with a database name `database_development`
Update the config/config.json to update the user/password required to connect to mysql

MacOSX
node_modules/.bin/sequelize db:migrate
Windows
node_modules\.bin\sequelize db:migrate
```

### server
```bash
# development
npm start
```

## Postman Collection url and documentation for Web services
* https://www.getpostman.com/
* https://www.getpostman.com/collections/99a8ebd8dabe6c57bfee
