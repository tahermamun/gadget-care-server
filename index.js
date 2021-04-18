const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('Mongodb').MongoClient
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkst0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const servicesCollection = client.db(`${process.env.DB_NAME}`).collection("services");
    const serviceOrderCollection = client.db(`${process.env.DB_NAME}`).collection("serviceOrder");
    const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");


    // Service add method
    app.post('/addService', (req, res) => {
        const newService = req.body
        servicesCollection.insertOne(newService)
            .then(res => {
                console.log('inserted', res.insertedCount)
                res.send(res.insertedCount > 0)
            })
    })

    app.post('/addServiceOrder', (req, res) => {
        const newServiceOrder = req.body
        serviceOrderCollection.insertOne(newServiceOrder)
            .then(res => {
                console.log('inserted', res.insertedCount)
                res.send(res.insertedCount > 0)
            })
    })

    app.post('/addReview', (req, res) => {
        const newServiceOrder = req.body
        reviewCollection.insertOne(newServiceOrder)
            .then(res => {
                console.log('inserted', res.insertedCount)
                res.send(res.insertedCount > 0)
            })
    })

    app.post('/makeAdmin', (req, res) => {
        const newServiceOrder = req.body
        adminCollection.insertOne(newServiceOrder)
            .then(res => {
                console.log('inserted', res.insertedCount)
                res.send(res.insertedCount > 0)
            })
    })




    //All Services Load Method 
    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })


    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })

    // Single services Load Method
    app.get('/payment/:serviceId', (req, res) => {
        servicesCollection.find({ _id: ObjectID(req.params.serviceId) })
            .toArray((err, document) => {
                res.send(document[0])
                console.log(document[0])
            })
    })



    app.get('/orderList', (req, res) => {

        serviceOrderCollection.find({ email: req.query.email })
            .toArray((err, document) => {
                res.send(document)
            })

    })

    app.get('/manageServices', (req, res) => {

        servicesCollection.find()
            .toArray((err, document) => {
                res.send(document)
            })

    })

    //Delete Services Method
    app.delete('/deleteService/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        console.log(id)
        servicesCollection.findOneAndDelete({ _id: id })
            .then(document => res.send(document))
    })



    app.patch('/update/:id', (req, res) => {

        console.log('STATUS HERE: ', req.body.OrderStatus)
        console.log('UPDATE ID: ', req.params.id)

        const id = ObjectID(`${req.params.id}`)

        serviceOrderCollection.updateOne({ _id: id },
            {
                $set: { OrderStatus: req.body.OrderStatus }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })

    })


    app.post('/isAdmin', (req, res) => {
        const email = req.body.email
        adminCollection.find({ adminEmail: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0)
            })

    })




});








const port = 5000;
// app.get('/', (req, res) => {
//     res.send('hello me')
// })

app.listen(process.env.PORT || port)