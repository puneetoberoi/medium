const express = require('express')
const port = process.env.PORT || 3000
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
console.log(path.join(__dirname))
let app = express();
app.use(express.static('public')) //to use an external css file we have to use this
// var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(bodyParser.json()); //.use is to introduce middlewware
app.use(cookieParser());

const atlastURL="mongodb+srv://puneet:02040204@nodeapi-etlso.mongodb.net/test?retryWrites=true&w=majority";

const databaseName = 'media';
var db
var put
var methods = [];
MongoClient.connect('mongodb+srv://puneet:02040204@nodeapi-etlso.mongodb.net/test?retryWrites=true&w=majority',{useUnifiedTopology: true}, (err, database) => {
  if (err) return console.log(err)
  db = database.db(databaseName)
  console.log("connected");
//   app.listen(process.env.PORT || 3000, () => {
//     console.log('listening on 3000')
//   })
})

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../public', 'home.html'))
})

app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname, '../public', 'login.html'))
})

app.post('/login', (req, res)=>{
    //save to database
})

app.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname, '../public', 'register.html'))
})

app.post('/register', (req, res)=>{
    //save to database
    console.log(req.body)
    db.collection('users').insertOne({"email": req.body.userEmail}, {"password": req.body.password})
    res.redirect('/')
})

app.get('/create-article', (req, res)=>{
    res.sendFile(path.join(__dirname, '../public', 'create-article.html'))
})

app.post('/create-article', (req, res)=>{
    console.log(req.body)
    let dataToWrite = JSON.stringify(req.body)
    fs.writeFileSync('output.json', dataToWrite)
    // res.sendFile(path.join(__dirname, '../public', 'create-article.html'))
    res.redirect('/')
})

app.get('/article-one', (req, res)=>{
    // res.sendFile(path.join(__dirname, '../public', 'index.html'))
    res.send(createTemplate(data))
})

//creating article and storing all different fields in a json string in a file on db
let data = {
    title: "Article-One | Nanak Naam",
    date: "Jun 14, 2020",
    content: `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem ratione dolores, nihil et velit voluptas
    autem ipsam nam, obcaecati dolor quos eius unde repellat eaque officia necessitatibus labore quo explicabo
    illum asperiores nulla? Error praesentium enim iste vitae excepturi fuga nobis aperiam eius. Eveniet magnam
    necessitatibus unde, eos rem placeat.</p>

<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem ratione dolores, nihil et velit voluptas
    autem ipsam nam, obcaecati dolor quos eius unde repellat eaque officia necessitatibus labore quo explicabo
    illum asperiores nulla? Error praesentium enim iste vitae excepturi fuga nobis aperiam eius. Eveniet magnam
    necessitatibus unde, eos rem placeat.</p>

<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem ratione dolores, nihil et velit voluptas
    autem ipsam nam, obcaecati dolor quos eius unde repellat eaque officia necessitatibus labore quo explicabo
    illum asperiores nulla? Error praesentium enim iste vitae excepturi fuga nobis aperiam eius. Eveniet magnam
    necessitatibus unde, eos rem placeat.</p>`
}

//load that object in a function where html will be created
function createTemplate(data){
    let title = data.title;
    let date = data.date;
    let content = data.content;

    let htmlTemplate = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="css/nanak.css">
    </head>
     
    <body>
        <div class="tags">
            <a href="/">Home</a>
        </div>
        <h3>Article-One</h3>
        <div class="date">Date Created - ${date} and Today's date - ${new Date()}</div>
        <div class="content">
            ${content}
        </div>
    </body>
    
    </html>`

    return htmlTemplate
}


app.listen(port, ()=>{
    console.log(`server up and running on port ${port}`)
})