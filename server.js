const {MongoClient, ObjectId} = require("mongodb")
const express = require("express")
const multer = require('multer')
const upload = multer()  //you need this if you let user upload files
const sanititzeHTML = require('sanitize-html')
const fse = require('fs-extra')
const sharp= require('sharp')
const path = require("path")
const React = require("react")
const ReactDOMServer = require('react-dom/server')
const PlantCard = require("./src/components/PlantCard").default
const Footer = require("./src/components/Footer").default
const NavBar= require("./src/components/Navbar").default

//when the app first launches, make sure the public/uploaded-phots exist

fse.ensureDirSync(path.join("public", "uploaded-photos"))

const app = express()
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(express.static("public"))
let db


app.use(express.json())
app.use(express.urlencoded({extended: false}))

//this function can be used for any route
function passwordProtected(req, res, next) { //middleware authentication
    res.set("WWW-Authenticate", "Basic Realm='Our Mern App'")
    if (req.headers.authorization == "Basic YWRtaW46YWRtaW4="){
        next()
    } else {
        console.log(req.headers.authorization)
        res.status(401).send("Try again")
    }
}

app.get("/", async(req, res) => {
    const allPlants = await db.collection("plants").find().toArray()
    const generatedHTML = ReactDOMServer.renderToString(
        <div className="container">
            <NavBar />
            <div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </div>
            {! allPlants.length && <h1> There are no plants to be taken care of, admin needs to add few</h1>}
            <div className="animal-grid mb-3">
                {allPlants.map(plant => <PlantCard key={plant._id} name={plant.name} species={plant.species} photo={plant.photo} id={plant.id} readOnly={true}/>)}
            </div>
            <Footer />
        </div>
    )
    res.render("home", {generatedHTML})

})

//all the routes after line 30 are password protected
app.use(passwordProtected)

app.get("/admin", (req, res) => {
    res.render("admin")
})

app.get("/api/plants", async(req, res) => {
    const allPlants = await db.collection("plants").find().toArray()
    res.json(allPlants)
})

app.post("/create-plants", upload.single("photo"), ourCleanup, async(req, res) => {
    if (req.file) { //if someone has included photo
        const photofilename = `${Date.now()}.jpg`
        await sharp(req.file.buffer).resize(844, 456).jpeg({quality: 60}).toFile(path.join("public", "uploaded-photos", photofilename))
        req.cleanData.photo = photofilename

    }
    console.log(req.body)
    const info = await db.collection("plants").insertOne(req.cleanData)
    const newPlant = await db.collection("plants").findOne({_id: new ObjectId(info.insertedId)})
    res.send(newPlant)
})

app.delete("/plant/:id", async (req, res) => {
    if (typeof req.params.id != "string") req.params.id = ""
    const doc = await db.collection("plants").findOne({_id: new ObjectId(req.params.id)})
    if (doc.photo){
        fse.remove(path.join("public", "uplaoded-photos", doc.photo))
    }
    db.collection("plants").deleteOne({_id: new ObjectId(req.params.id)})
    res.send("Good Job")
})

app.post("/update-plant", upload.single("photo"), ourCleanup, async (req, res) => {
    if (req.file) {
        //if uploading a new photo
        const photofilename = `${Date.now()}.jpg`
        await sharp(req.file.buffer).resize(844, 456).jpeg({quality: 60}).toFile(path.join("public", "uploaded-photos", photofilename))
        req.cleanData.photo = photofilename
        const info = await db.collection("plants").findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData})
        if (info.value.photo){
            fse.remove(path.join("public", "uploaded-photos", info.value.photo))
        }
        res.send(photofilename)
    }else {
        console.log("yesssss")
        // if not uploading a new photo
        db.collection("plants").findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData})
        res.send(false)
    }
})

function ourCleanup(req, res, next) {
    if (typeof req.body.name != "string") req.body.name = ""
    if (typeof req.body.species != "string") req.body.species = ""
    if (typeof req.body._id != "string") req.body._id = ""

    // donot allow any html format data enter into the database
    req.cleanData = {
        name: sanititzeHTML(req.body.name.trim(), {allowedTags: [], allowedAttributes: {}}),
        species: sanititzeHTML(req.body.species.trim(), {allowedTags:[], allowedAttributes: {}}),    
    }
    next()
}

async function start(){
    const client = new MongoClient("mongodb+srv://admin2:K1M2oQqjnq9owQpd@mern.5drfrse.mongodb.net/AmazingMernApp?retrywrites=true&w=majority")
    await client.connect()
    db = client.db()
    console.log(db.collection)
    app.listen(5000)
}
start()

