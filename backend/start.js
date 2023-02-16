//The sole purpose of this file is to start the server.
//We can run the server using command 'npm start'
//and go to localhost:3000 on any browser

const app = require("./server.js");

//website is hosted on this port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
