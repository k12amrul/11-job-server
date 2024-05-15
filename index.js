const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');


// app.use(cors())
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }

  app.use(cors(corsConfig))
  

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

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};


async function run() {
  try {


    const jobsCollection = client.db("jobDB").collection("jobs");
    const applyCollection = client.db("jobDB").collection("apply");



    // const logger = async (req, res, next) => {
    //   console.log('called : ', req.host, req.originalUrl)

    //   next()

    // }
    // const verifyToken = async (req, res, next) => {
    //   const token = req.cookies?.token
    //   console.log('  token in middleware ', token)
    //   if (!token) {
    //     return res.status(401).send({ message: 'not authorized ' })
    //   }

    //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    //     console.log(err)
    //     if (err) {
    //       return res.status(401).send({ message: 'un authorized ' })

    //     }
    //     console.log(' value in token ', decoded)

    //     req.user = decoded

    //     next()
    //   })
    //   //  token asena 
    //   //  req.userJwt= decoded

    //   // next()

    // }

    // app.post('/jwt', logger, (req, res) => {
    //   // console.log( process.env.ACCESS_TOKEN_SECRET)
    //   const user = req.body
    //   // console.log("user for token", user)
    //   // console.log( process.env.ACCESS_TOKEN_SECRET)
    //   const token = jwt.sign({
    //     user
    //   }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    //   console.log({token :token} )
    //   res
    //     .cookie('token', token,cookieOptions 
    //     //  {
    //     //   httpOnly: true,
    //     //   secure: false,
    //     //   //  sameSite: 'none'
    //     // }
    //   )
    //     .send({ success: true })




    // })





    // app.post("/logout", async (req, res) => {
    //   const user = req.body
    //   console.log('log out ', user)

    //   res.clearCookie('token', { maxAge: 0 }).send({ success: true })

    // })







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

    app.get('/myjobs/:email',  async (req, res) => {
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

    app.get('/applyJob', async (req, res) => {
      const query = applyCollection.find()
      const result = await query.toArray()
      res.send(result)

    })


    app.post( '/applyJob',async( req ,res )  =>{ 

      const appliedJob= req.body
      const result = await applyCollection.insertOne(appliedJob )

      res.send( result)


    } )




    app.get('/', (req, res) => {
      res.send('a-11-- eleven server testing successfully ')
    })






  } finally {

  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
