const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')
const cors = require('cors');  // Import the cors package
const axios = require('axios');
const bcrypt = require('bcrypt');
const saltRounds = 10;  // Number of salt rounds for hashing

// init app & middleware
const app = express()
const port = process.env.PORT || 8080; 
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PATCH', 'DELETE'] // Allow specific HTTP methods
}));

// db connection
let db;

connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log('app listening on port '+port);
        })
        db = getDb();
    } else {

    }
})

app.get("/", (req, res) => {
    res.status(200).send("<h1>Hello World</h1>");
});


app.get('/users/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('users')
            .findOne({ _id: new ObjectId(req.params.id) })
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({ error: 'Could not fetch user' })
            })
    } else {
        res.status(500).json({ error: 'The user id is invalid' })
    }
})

app.post('/register', (req, res) => {
    const user = req.body;

    // Check if the username or email already exists
    db.collection('users')
        .findOne({ username: user.username })
        .then(result => {
            if (result) {
                res.status(201).json({ exists: "username" })
            } else {
                db.collection('users')
                    .findOne({ email: user.email })
                    .then(result => {
                        if (result) {
                            res.status(201).json({ exists: "email" })
                        } else {
                            // Hash the password before storing it
                            bcrypt.hash(user.password, saltRounds, (err, hashedPassword) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Could not hash the password' });
                                }
                                const newUser = {
                                    username: user.username.toLowerCase(),
                                    firstName: user.firstName.toLowerCase(),
                                    lastName: user.lastName.toLowerCase(),
                                    email: user.email.toLowerCase(),
                                    password: hashedPassword,  // Store the hashed password
                                    phoneNumber: user.phoneNumber,
                                    assets: [],
                                    posts: [],
                                    deposit: {
                                        initial: 0,
                                        invested: 0,
                                    }
                                };
                                db.collection('users')
                                    .insertOne(newUser)
                                    .then(result => {
                                        res.status(201).json({ exists: "false", id: result.insertedId })
                                    })
                                    .catch(err => {
                                        res.status(500).json({ err: 'Could not create a new document' })
                                    });
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).json({ err: 'Could not create a new document' });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ err: 'Could not create a new document' });
        });
});


app.post('/login', (req, res) => {
    const user = req.body;
    db.collection('users')
        .findOne({ username: user.username.toLowerCase() })
        .then(result => {
            if (!result) {
                return res.status(201).json({ exists: "false" });
            }
            // Compare the hashed password with the provided password
            bcrypt.compare(user.password, result.password, (err, match) => {
                if (err) {
                    return res.status(500).json({ error: 'Password comparison failed' });
                }
                if (match) {
                    res.status(201).json({ exists: "true", id: result._id });
                } else {
                    res.status(201).json({ exists: "false" });
                }
            });
        })
        .catch(err => {
            res.status(500).json({ err: 'Could not create a new document' });
        });
});


app.post('/buy', async (req, res) => {
    const { symbol, money, userId } = req.body; // User specifies symbol and money to invest
    const interval = '1m'; // Using 1-minute interval for current price data
    const startTime = Date.now(); // Get current timestamp

    try {
        // Fetch current price (real-time price for the symbol)
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
            params: { symbol: symbol }  
        });
        const closePriceOnStart = parseFloat(response.data.price);

        const quantity = money / closePriceOnStart;

        const asset = {
            symbol,
            quantity,
            money,
            interval,
            closePriceOnStart,
            startTime: new Date(startTime),
            _id: new ObjectId()
        }

        const collection = db.collection('users');
        const result = await collection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $push: { assets: asset },
                $inc: { 'deposit.invested': parseInt(money) }
            },
        );

        res.send(`Bought ${quantity} ${symbol} at ${closePriceOnStart} USDT`);

    } catch (error) {
        console.error('Error during buying:', error);
        res.status(500).json({ error: 'Error during buying process' }); // Return error as JSON
    }
});

app.post('/sell/:id', async (req, res) => {
    const userId = req.params.id;
    const { assetId } = req.body;

    try {
        // Find the asset by its ID
        const collection = db.collection('users');
        const assetsResponse = await collection
            .findOne(
                { _id: new ObjectId(userId) },
                { projection: { assets: { $elemMatch: { _id: new ObjectId(assetId) } } } }
            );
        
        if (!assetsResponse || !assetsResponse.assets.length) {
            return res.status(404).send('Asset not found');
        }

        let asset = assetsResponse.assets[0];

        // Fetch current price
        const currentPriceResponse = await axios.get('https://api.binance.com/api/v3/ticker/price', {
            params: { symbol: asset.symbol }
        });

        const currentPrice = parseFloat(currentPriceResponse.data.price);
        console.log(currentPriceResponse, currentPrice);

        // Calculate profit or loss
        const profitOrLoss = (currentPrice - asset.closePriceOnStart) * asset.quantity;
        console.log(profitOrLoss);

        // Save the transaction to the Post collection
        const post = {
            _id: new ObjectId(),
            startTime: asset.startTime,
            symbol: asset.symbol,
            interval: asset.interval,
            profitOrLoss,
            money: asset.money,
            quantity: asset.quantity,
            sellTime: new Date(),
        };

        // Update the user's deposit:
        // 1. Add the profitOrLoss to deposit.initial
        // 2. Subtract the money (initial investment) from deposit.invested
        const updateDeposit = await collection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $inc: {
                    'deposit.initial': profitOrLoss, // Add the profit/loss
                    'deposit.invested': -asset.money  // Subtract the money invested
                }
            }
        );

        // Push the sale record to the posts collection
        const updatePosts = await collection.updateOne(
            { _id: new ObjectId(userId) },
            { $push: { posts: post } }
        );

        // Remove the sold asset from the assets collection
        const updateAssets = await collection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { assets: { _id: new ObjectId(assetId) } } }
        );

        res.json({ text: `Sold ${asset.symbol} with a profit/loss of ${profitOrLoss} USDT` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error during selling process' });
    }
});
