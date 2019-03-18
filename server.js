import '@babel/polyfill';
import express from 'express';
const environment = process.env.NODE_ENV || 'development';
const app = express();
app.use(express.json());
app.set('port', process.env.PORT || 3001);

// GET:
// All projects
app.get('/api/v1/projects', async (req, res) => {
  try {
    res.status(200).json('Hello Projects');
  } catch (error) {
    res.status(500).json({ error });
  } 
});

// All palettes
app.get('/api/v1/palettes', async (req, res) => {
  try {
    res.status(200).json('Hello Palettes');
  } catch (error) {
    res.status(500).json({ error });
  }
});

// One project
app.get('api/v1/projects/:id', async (req, res) => {
    try {
        res.status(200).json('Hello 1 project');
    } catch (error) {
        res.status(500).json({ error })
    }
});

// One palette
app.get('api/v1/palettes/:id', async (req, res) => {
    try {
        res.status(200).json('Hello 1 palette');
    } catch (error) {
        res.status(500).json({ error })
    }
});

app.listen(app.get('port'), () => {
  console.log(`Server running on port: ${app.get('port')}`);
});