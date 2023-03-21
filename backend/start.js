//The sole purpose of this file is to start the server.
//We can run the server using command 'npm start'
//and go to localhost:3000 on any browser
require("dotenv").config();
const app = require("./server.js");
const mongoose = require("mongoose");

//website is hosted on this port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  //DB connection after app is hosted
  mongoose
    .connect(process.env.MONGO_URL, {
      //need MONGO_URL from .env
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("Connected to MongoDB"))
    .catch((error) => {
      console.log("DB CONNECTION ERROR: " + error);
    });
});