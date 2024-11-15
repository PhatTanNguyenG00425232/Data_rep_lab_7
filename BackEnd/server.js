const express = require('express');
const app = express();
const port = 4000;

//enable CORS for server
const cors = require('cors');
app.use(cors());

//the set up allow frontend to make api request for backend
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Add body-parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.kjdsv.mongodb.net/DB11');


//Define schema and data mode
//create object for database
const movieSchema = new mongoose.Schema({
  title:String,
  year:String,
  poster:String
})
const movieModel = new mongoose.model('MyMovies',movieSchema);

//Get request to api/movies to return JSON data
app.get('/api/movies', async(req, res) => {
    const movies = await movieModel.find({});//The empty object {} as an argument means it fetches all documents in the movies collection.
    res.status(200).json({movies})
});

//Create a method to retrieve a specific movie by its ID
app.get('/api/movie/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);//This method searches the movies collection for a document with the ID provided in the URL
  res.send(movie);
});

//after input the data step (clicking submit)
app.post('/api/movies',async(req, res)=>{//async allows us to use await, which pauses the function until the operation completes
    console.log(req.body.title);
    //put the data into object
    const{title,year,poster} = req.body;
    //A new Movie instance is created using new Movie({ title, year, poster })
    const newMovie = new movieModel({title,year,poster});
    await newMovie.save();//await newMovie.save() ensures the movie is saved to the database before continuing
    //output respond
    res.status(201).json({ message: 'Movie created successfully', movie: newMovie });
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});