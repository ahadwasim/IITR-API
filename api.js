const express = require('express')
const app = express()
const port = 8080

app.use(express.json())
const SECRET_KEY = 'YWxhZGRpbjpvcGVuc2VzYW1l'

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'street_eye_db'
});

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).send('Unauthorized')
    return
  }

  const [, token] = authHeader.split(' ')
  if (token !== SECRET_KEY) {
    res.status(402).json({ message: 'invalid token' });
    return
  }

  next()
}

// Define a GET route for the root path
app.get('/', authenticate, (req, res) => {
  res.send('Test API!')
})

// // Define a GET route for the '/users' path
// app.get('/users', authenticate, (req, res) => {
//   const users = [{ name: 'John Doe' }, { name: 'Jane Smith' }]
//   res.json(users)
// })

// Define a POST route for the '/users' path
app.post('/postdata', authenticate, (req, res) => {
  var type, latitude, longitude, timestamp;
  const dataJSON = req.body;
  console.log(dataJSON)
  const sql = `INSERT INTO tbl_info (type, latitude, longitude, ts_client) VALUES (?, ?, ?, ?)`;
  var data;
  dataJSON.forEach(item => {
    type = item.type;
    timestamp = item.timestamp;
    latitude = item.location.latitude;
    longitude = item.location.longitude;

    console.log("Type: ", type);
    console.log("Timestamp: ", timestamp);
    console.log("Latitude: ", latitude);
    console.log("Longitude: ", longitude);

    data = [type, latitude, longitude, timestamp];

    connection.query(sql, data, (err, results) => {
      if (err) throw err;
      console.log(`Inserted ${results.affectedRows} row`);
    });
  });

  res.json({ message: 'success' });

  // try {
  //   dataJSON.forEach(item => {
  //     type = item.type;
  //     timestamp = item.timestamp;
  //     latitude = item.location.latitude;
  //     longitude = item.location.longitude;

  //     console.log("Type: ", type);
  //     console.log("Timestamp: ", timestamp);
  //     console.log("Latitude: ", latitude);
  //     console.log("Longitude: ", longitude);
  //   });
  // }
  // catch (e) {
  //   console.log("Error : " + e);
  //   res.status(400).json({ message: 'invalid json' });
  //   return
  // }
  // finally {
  //   const sql = `INSERT INTO tbl_info (type, latitude, longitude, ts_client) VALUES (?, ?, ?, ?)`;
  //   const data = [type, latitude, longitude, timestamp];

  //   connection.query(sql, data, (err, results) => {
  //     if (err) throw err;
  //     console.log(`Inserted ${results.affectedRows} row`);
  //   });
  //   res.json({ message: 'success' });
  //   return
  // }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})