const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');


// app.use(cors())
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true

}))
app.use(express.json())
app.use(cookieParser())
// app.use(cors({ origin: ["http://localhost:5173", "https://eloquent-dango-c20301.netlify.app"] }))
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)

// 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uftqkre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://test-server:test-server123@cluster0.uftqkre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


    const jobsCollection = client.db("jobDB").collection("jobs");


    app.get('/jobs', async (req, res) => {
      const query = jobsCollection.find()
      const result = await query.toArray()
      res.send(result)

    })

    app.get('/job/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await jobsCollection.findOne(query)


      res.send(result)
    })

    app.get('/myjobs/:email', async (req, res) => {
      const email = req.params.email

      const query = { loggedInUserEmail: email }

      const result = await jobsCollection.find(query).toArray()
      res.send(result)

    })

    app.post( '/job',async( req ,res )  =>{ 

      const newJob= req.body
      const result = await jobsCollection.insertOne(newJob )

      res.send( result)


    } )

    app.put('/job/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const updatedItem = req.body
      const options = { upsert: true }
      const jobItem = {
        $set: {

          ...updatedItem

         
          // user_email: updatedItem.user_email,
          // user_name: updatedItem.user_name,



        }
      }
      const result = await jobsCollection.updateOne(filter, jobItem, options)
      res.send(result)


    })

    app.delete('/job/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }

      const result = await jobsCollection.deleteOne(query)
      res.send(result)
    })





    app.get('/', (req, res) => {
      res.send('a-11 server testing successfully ')
    })






  } finally {

  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
