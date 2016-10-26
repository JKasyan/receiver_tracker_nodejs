# receiver_tracker_nodejs
Module saves gps data in mongo db.
After success saving in db server broacasts
gps data for all subscribed users.

# Technologies:
 - Node.js
 - Express.js
 - Socket.io
 - Mongoose

# Run:
 - git clone https://github.com/JKasyan/receiver_tracker_nodejs.git
 - npm install
 - MONGODB_URI=mongodb://user:password@host:port/dbName node app.js
