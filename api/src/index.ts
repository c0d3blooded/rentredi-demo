/*
Task name: User endpoints

Requirements
  1.  We need to create CRUD endpoints
  2.  The entries (users) can just be saved in a noSQL database (Bonus for using Firebase Realtime Database)
  3.  Each user should have the following data entries: 
        id, name, zip code, latitude, longitude, timezone
  4.  When creating a user, allow input for name and zip code.  
      (Fetch the latitude, longitude, and timezone - Documentation: https://openweathermap.org/current) 
  5.  When updating a user, Re-fetch the latitude, longitude, and timezone (if zip code changes)
  6.  Connect to a ReactJS front-end
  * feel free to add add something creative you'd like

  API Key: 7afa46f2e91768e7eeeb9001ce40de19
*/

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// initialize firebase
require("./services/firebase");
const users = require("./routes/users");

app.use("/", users);

app.listen(8080);
