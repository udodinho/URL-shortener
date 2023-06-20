require('dotenv').config()
const express = require("express");
const app = express();
const ShortUrl = require("./models/shortUrl")
const connectDB = require("./db/connect");

const port = process.env.PORT || 3000

app.set("view engine", "ejs")
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.get("/", async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render("index", {shortUrls: shortUrls})
})

app.post("/shortUrls", async (req, res) => {
    await ShortUrl.create({ full: req.body.url })

    res.redirect("/")
})

app.get("/:shortUrl", async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })

    if (shortUrl == null) res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()
    
    res.redirect(shortUrl.full)
})
 
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server started on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()
