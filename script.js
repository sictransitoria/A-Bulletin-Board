// Modules
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const {Client} = require('pg');
const dotenv = require('dotenv');

// Create a New Express Application
const app = express();

// Connect to Database
const connectionString = 'postgresql://postgres:Runner4life!@localhost:5432/bulletinboard'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('Public'));  
app.set('view engine', 'ejs');


// GET
app.get('/', (req, res) => {
  const client = new Client({
  	connectionString: connectionString,

  })

  client.connect()
  .then(() => {
  	return client.query (`SELECT * FROM messages`)
  
  })
  
    .then((result) => {
    return res.render('messages', {result})
  
  })

});

// POST A MESSAGE
app.post('/add', (req, res) => {
  const client = new Client({
    connectionString: connectionString,

  })

  client.connect()
  .then(() => {
    return client.query(`INSERT INTO messages (subject, memo) VALUES ($1, $2)`, [req.body.subject, req.body.memo]);
  
  })
  
    .then((result) => {
    return res.redirect('/')
 
  })

});


// EDIT A BULLETIN
app.get('/edit/messages/:id', (req, res) => {
  const client = new Client({
    connectionString: connectionString,

  })

  client.connect()
  .then(() => {
    return client.query(`SELECT * FROM messages WHERE id=$1`, [req.params.id]);
  
  })
  
    .then((result) => {
    return res.render('edit-bulletin', {result});
 
  })

});

// UPDATE A BULLETIN
app.post('/update', (req, res) => {
  const client = new Client({
    connectionString: connectionString,

  })

  client.connect()
  .then(() => {
    return client.query(`UPDATE messages SET subject=$1, memo=$2 WHERE id=$3`, [req.body.subject, req.body.memo, req.body.id]);
  
  })
  
    .then((result) => {
    return res.redirect('/');
 
  })

});

// DELETE A BULLETIN
app.post('/delete/messages/:id', (req, res) => {
  const client = new Client({
  	connectionString: connectionString,

  })

  client.connect()
  .then(() => {
  	return client.query (`DELETE FROM messages WHERE id=$1`, [req.params.id]);
  
  })
  
    .then((result) => {
    return res.redirect('/')
 
  })

});


app.listen(3000, () => {
    console.log('Server Started on Port: 3000');
});