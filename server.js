const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.static('Develop/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.delete('/api/notes/:id', (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf-8'));
  let noteID = req.params.id;
  savedNotes = savedNotes.filter(note => {
    return note.id != noteID;
  });
  let updatedID = 0;
  savedNotes.forEach(note => {
    note.id = updatedID.toString();
    updatedID++;
  });
  fs.writeFileSync('./Develop/db/db.json', JSON.stringify(savedNotes));
  res.json(savedNotes);
});

app.post('/api/notes', (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf-8'));
  let note = req.body;
  let id = savedNotes.length.toString();
  note.id = id;
  savedNotes.push(note);
  fs.writeFileSync('./Develop/db/db.json', JSON.stringify(savedNotes));
  res.json(savedNotes);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/db/db.json'));
});

app.get('/api/notes/:id', (req, res) => {
    let savedNotes = JSON.parse(fs.readFileSync('.Develop/db/db.json', 'utf-8'));
    res.json(savedNotes[Number(req.params.id)]);
});

app.listen(PORT, () =>
  console.log(`App listening at 127.0.0.1:${PORT}`)
);