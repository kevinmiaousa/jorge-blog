import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import path from 'path'

mongoose.Promise = Promise
const dbUrl = "mongodb+srv://kmongo:k269157@cluster0-romii.mongodb.net/test?retryWrites=true&w=majority"
const Article = mongoose.model("Article", {
    name: String,
    upvotes: Number,
    comments: []
});

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());

app.get('/api/articles/:name', async (req, res) => {
    try {
        const articleName = req.params.name;
        var article = await Article.findOne({ name: articleName })
        res.status(200).json(article)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error connect to db"})
    }
})


app.post('/api/articles/:name/upvote', async (req, res) => {
    try{
        const articleName = req.params.name;
        var article = await Article.findOne({ name: articleName })
        article.upvotes += 1;
        var updated = await article.save();
        //articlesInfo[articleName].upvotes += 1;
        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error connect to db"})
    }
})

app.post('/api/articles/:name/add-comment', async (req, res) => {
    try {
        const { username, text } = req.body;
        const articleName = req.params.name;
        var article = await Article.findOne({ name: articleName });
        article.comments.push({ username, text });
        var updated = await article.save();
        res.status(200).send(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error connect to db"});
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});
mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
    console.log("mongo connected:", err)
});
app.listen(8000, () => {
    console.log('port 8000');
});


