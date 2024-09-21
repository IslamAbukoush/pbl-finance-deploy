const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')
const cors = require('cors');  // Import the cors package

// init app & middleware
const app = express()
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PATCH', 'DELETE'] // Allow specific HTTP methods
}));

// db connection
let db;

connectToDb((err) => {
    if(!err) {
        app.listen(3000, () => {
            console.log('app listening on port 3000');
        })
        db = getDb();
    } else {

    }
})




app.get('/users', (req, res) => {
    let users = []
    db.collection('users')
    .find()
    .forEach(user => users.push(user))
    .then(() => {
        res.status(200).json(users);
    })
    .catch(() => {
        res.status(500).json({error: 'Could not fetch documents'})
    })
})

// app.get('/books/:id', (req, res) => {
//     if(ObjectId.isValid(req.params.id)) {
//         db.collection('books')
//         .findOne({_id: new ObjectId(req.params.id)})
//         .then(doc => {
//             res.status(200).json(doc)
//         })
//         .catch(err => {
//             res.status(500).json({error: 'Could not fetch book'})
//         })
//     } else {
//         res.status(500).json({error: 'The book id is invalid'})
//     }
// })

app.post('/users', (req, res) => {
    const user = req.body;

    db.collection('users')
    .insertOne(user)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({err: 'could not create a new document'})
    })
})

// app.delete('/books/:id', (req, res) => {
//     if(ObjectId.isValid(req.params.id)) {
//         db.collection('books')
//         .deleteOne({_id: new ObjectId(req.params.id)})
//         .then(result => {
//             res.status(200).json(result)
//         })
//         .catch(err => {
//             res.status(500).json({error: 'Could not delete book'})
//         })
//     } else {
//         res.status(500).json({error: 'The book id is invalid'})
//     }
// })

// app.patch('/books/:id', (req, res) => {
//     const updates = req.body

//     if(ObjectId.isValid(req.params.id)) {
//         db.collection('books')
//         .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
//         .then(result => {
//             res.status(200).json(result)
//         })
//         .catch(err => {
//             res.status(500).json({error: 'Could not update book'})
//         })
//     } else {
//         res.status(500).json({error: 'The book id is invalid'})
//     }
// })