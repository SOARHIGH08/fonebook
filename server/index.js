const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect database to the server
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "fonebook"
})

// GET DATA
app.get("/contacts", (request, response) => {
    
    const sqlSelect = "SELECT * FROM contacts";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log("Cannont fetch data");
        } else {
            response.send(result);
        }
    })
})


// INSERT DATA
app.post("/contacts/add", (request, response) => {

    const name = request.body.name;
    const mobile = request.body.mobile;
    const sqlInsert = "INSERT INTO contacts (name, mobile) VALUES (?, ?)";

    db.query(sqlInsert, [ name, mobile ], (err, result) => {
        if (err) {
            console.log("error");
        } else {
            console.log(result);
        }
    });
});


// DELETING DATA
app.delete("/contacts/delete/:id", (request, response) => {
    
    const id = request.params.id;
    const sqlDelete = "DELETE FROM contacts WHERE id = ?";
    db.query(sqlDelete, id, (err, result) => {
        if (err) {
            console.log("Cannot delete item!");                    
        } else {
            console.log(`${ result } Successfully deleted`);
        }
    })
})

// UPDATE DATA
app.put("/contacts/update/", (request, response) => {

    const id = request.body.id;
    const num = request.body.mobile;
    const sqlUpdate = "UPDATE contacts SET mobile = ? WHERE id = ?";
    db.query(sqlUpdate, [ num, id ], (err, result) => {
        if (err) {
            console.log("Cannot update!");
        } else {
            console.log("Successfully updated!");
        }
    })
})
  

app.listen(3001, () => {
    console.log(`running on server ${ PORT }`);
})

