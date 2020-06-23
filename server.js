// ce528fa2-8bb2-4b60-b8fc-01da266af542
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const cors = require('cors');
const helmet = require('helmet');
const MOVIES = require('./movies-data-small.json');


const app = express();

app.use(morgan('dev'));

app.use(cors());
app.use(helmet());



app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_KEY;
  const authToken = req.get('Authorization');

  if (!authToken || (authToken.split(' ')[1] !== apiToken))
    return res.status(401).json({ error: 'Unauthorized request' });

  next();
});



  app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIES;



  if (req.query.genre) {
    response = response.filter(movie =>
      // case insensitive searching
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  // filter our pokemon by type if type query param is present
  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.includes(req.query.country)
    );
  }

  if (req.query.avg_vote) {
    response = response.filter(movie =>
      movie.avg_vote.includes(req.query.avg_vote)
    );
  }

  res.json(response);
});



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});