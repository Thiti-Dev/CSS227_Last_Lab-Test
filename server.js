const express = require('express');
const app = express();
const mongoose = require('mongoose');

var jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { document } = (new JSDOM('')).window;
global.document = document;

//static
const port = 5000;

//creating public
app.use(express.static(__dirname + '/public'));


//set view engine to EJS
app.set('view engine', 'ejs');

//use body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//Connecting to the mongoose
mongoose
    .connect('mongodb://localhost/testlab', { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
        console.log("MongoDB Connected")
    })
    .catch(err => {
        console.log(err)
    })


//loading the modules
const Post = require('./models/post')


app.get('/', (req,res) => {
    var posts; //predefined variable

    //loading the post
    Post.find()
    .then(post => {
        if (post) {
            //res.json(post);
            posts = post;
            console.log(`found post with total ${posts.length}`)
            res.render('pages/index', {posts});
        }
        else {
            //res.status(400).json({ post: "User not found" })
        }
    })
    .catch(err => {
        console.log(err)
    })

    //res.render('pages/index', {posts});
})

app.get('/newpost', (req,res) => {
    res.render('pages/post');
})

app.post('/createpost', (req,res) => {
    console.log(`title = ${req.body.title}`)
    console.log(`body = ${req.body.body}`)

    const newPost = new Post({
        title: req.body.title,
        body: req.body.body
    });
    newPost.save()
        .then(user => {
            //res.json(user);
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/viewmore', (req,res) => {
    //res.render('pages/viewmore')
    var singlePost;
    console.log(`id = ${req.body.id}`)

    //loading the post
    let x = '5cd3a5513031db0a68195879';
    Post.findById(req.body.id)
    .then(post => {
        if (post) {
            //res.json(post);
            singlePost = post;
            console.log(`found post with total ${singlePost.title}`)
            
            res.render('pages/viewmorePage', {post: singlePost});
            //res.render('pages/post');
            //res.redirect('/fixbug');
            //res.send("This is working");
        }
        else {
            //res.status(400).json({ post: "User not found" })
        }
    })
    .catch(err => {
        console.log(err)
    })

})

app.post('/edit', (req,res) => {
    var singlePost;
    Post.findById(req.body.id)
    .then(post => {
        if (post) {
            //res.json(post);
            singlePost = post;
            console.log(`found post with total ${singlePost.title}`)
            
            res.render('pages/editPost', {post: singlePost});
            //res.render('pages/post');
            //res.redirect('/fixbug');
            //res.send("This is working");
        }
        else {
            //res.status(400).json({ post: "User not found" })
        }
    })
    .catch(err => {
        console.log(err)
    })
})

app.post('/editdone', (req,res) => {
    Post.findById(req.body.id)
    .then(post => {
        if (post) {
            post.title = req.body.title,
            post.body = req.body.body
            
            post.save().then(() => {
                res.redirect("/");  
            })
        }
        else {
            //res.status(400).json({ post: "User not found" })
        }
    })
    .catch(err => {
        console.log(err)
    })
})


app.post('/delete', (req,res) => {
    Post.findByIdAndRemove(req.body.id)
        .then(() => {
            //res.json({success: true})
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('*', (req,res) => {
    res.render('pages/errorHandler');
})

app.listen(port, () => {
    console.log(`Server currently running ${port}`);
})