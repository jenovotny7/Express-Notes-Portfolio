const express = require("express");
const path = require("path");
const fs = require("fs");
const main = path.join(__dirname, "/public");
const app = express();

// needed for Heroku
const PORT = process.env.PORT || 3000;



app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/notes", function(req, res) {
    res.sendFile(path.join(main, "notes.html"));
});

app.get("/api/notes/:id", function(req, res) {
    let mysavedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(mysavedNotes[Number(req.params.id)]);
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});


app.get("*", function(req, res) {
    res.sendFile(path.join(main, "index.html"));
});

app.post("/api/notes", function(req, res) {
    let mysavedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (mysavedNotes.length).toString();
    newNote.id = uniqueID;
    mysavedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(mysavedNotes));
    console.log("Your Note is saved: ", newNote);
    res.json(mysavedNotes);
})

app.delete("/api/notes/:id", function(req, res) {
    let mysavedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Now deleting note ${noteID}`);
    mysavedNotes = mysavedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of mysavedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(mysavedNotes));
    res.json(mysavedNotes);
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  })
