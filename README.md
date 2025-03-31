# School Club Database Management System Documentation
•	This project is a database management system for Victory School clubs. It Club Admins  to manage club members, events, and other related data.
•	`The system has been developed using basic HTML, CSS AND JS for the frontend Create, Read, Update and Delete interface`

## Backend Services
•	`The backend services are all served by the server.js file which is the main Database Application System`
•	'The database file schoolClub.db is an SQLITE3 database file system for storing data for clubs and   manipulating all the other data as needed`

 ## Frontend Interface
•	` In the `public/` folder we have static files, `index.html`,`style.css` and `script.js`.`
•	`The `index.html` file serve as the root landing page for the CRUD interface. It has all the needed navigation links and buttons for viewing details directly from the database file`
-	For example we have the following views buttons/links Clubs:

	Patrons - Used to view all the patrons details and their roles
	Members - Used to view all the members who are registered in any of the clubs
	Activities - Used to view all the Clubs Activities
	Finances - Used to view all clubs finance reports
	Past Members - Used to track past members with the time they left the club(s)
	New Members - Used to track new members who have just joined a club at the start of evry academic year
	Reports - Used to generate reports for all clubs activities using scorecards, bar graphs and pie charts to gauge how clubs are performing.

	 - For example the below are navigation links to input forms for registering new club, new member,  	past-member members, finances and activity for clubs:

	Add Club - Adding a new club that has just been created
	Add Patron - Adding a new patron with their role
	Add Member - Adding a new member who has just joined a club
	Add Activity - Adding club activity that is to take place or took place
	Add Finance - Addidng finances
	Add Past Member - Adding a member who left a club or clubs
	Add New Member -Adding a new member who has just joined clube

`

## Getting Started

### Prerequisites

•	Make sure you have the following installed on your system:
a.	[Node.js](https://nodejs.org/) (v14 or higher)
b.	[npm](https://www.npmjs.com/) (Node package manager)

### Starting the Server

•	To start the Node.js server, run the following command:
```bash
	npm run dev
```

The server will start on the default port (e.g., 3000). You can access the application by navigating to 
`[http://localhost:3000] (http://localhost:3000)` in your web browser.

### Project Structure

	`server.js`: The main entry point of the Database application System.
	`package.js`: This is the dependency and all the needed packages manager file, it contains all the packages  such as:  SQLITE3 database module, express app and others.
	`public/` folder: Contains static files like CSS, JavaScript, and images.

### How the System Works

1. **Database Models**: 
	The system uses models to represent the data structure.
	These models are defined in the `server.js` file.
	Each model corresponds to a table in the database and defines the schema for that table.
	Example: A `Member` model might include fields like `name`, `email`, `role`, etc.


2. **Apps**: 
	The apps define the endpoints for the application.
	They are defined in the `server.js` file.
	Each app maps a URL to a specific controller function.
	Example: A `GET /members` app might retrieve a list of all club members,
o	A `POST /Clubs` app might register a new club into the clubs table,
o	A  `GET /tableName` app gets a specific table name from the schoolClub.db file,
o	A `POST /finances` app will add new financial revenue from a club into the finance table,
o	A `POST /new-members` app will register a new members who have joined for a club in a new academic year,
o	A `POST /past-members` app will be used tp register all the past members with the year they left a club


3. **Static Files**: 
	Static files such as CSS, JavaScript, and images are served from the `public/` directory.
	These files are used to enhance the front-end user experience.
	Example: A `style.css` file might contain the styling for the HTML templates.




