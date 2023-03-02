//The sole purpose of this file is to start the server.
//We can run the server using command 'npm start'
//and go to localhost:3000 on any browser
require("dotenv").config();
const app = require("./server.js");
const mongoose = require("mongoose");

//website is hosted on this port
const PORT = process.env.PORT || 3000;

//connect to database and then host app
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log("Connected to MongoDB");
      console.log(`App listening on port ${PORT}`);
    })
  )
  .catch((error) => {
    console.log("Error:" + error);
  });
