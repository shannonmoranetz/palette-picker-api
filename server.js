import '@babel/polyfill';
import express from 'express';
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const app = express();
app.use(express.json());
app.set('port', process.env.PORT || 3001);

// GET:
// All projects
app.get('/api/v1/projects', async (req, res) => {
  try {
    let projects = await database('projects').select();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// All palettes for one project
app.get('/api/v1/projects/:id/palettes', async (req, res) => {
  try {
    const projectId = req.params.id;
    const hexQuery = req.query.hex;
    let palettesForProject = await database('palettes').where('project_id', projectId);
    if (hexQuery) {
      palettesForProject = await palettesForProject.filter((palette) => {
        const { color1, color2, color3, color4, color5 } = palette;
        const colors = [color1, color2, color3, color4, color5];
        return colors.some(color => color === hexQuery);
      })
    }
    if (palettesForProject.length) {
      res.status(200).json({ palettes: palettesForProject });
    } else if (hexQuery) {
      res.status(404).json({ error: `No palettes found for hex code with the value of ${hexQuery}.` });
    } else {
      res.status(404).json({ error: `No palettes found for project with the id of ${projectId}.`})
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// One project
app.get('/api/v1/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id
    const selectedProject = await database('projects').where('id', projectId)
    if (selectedProject.length) {
      res.status(200).json({ project: selectedProject });
    } else {
      res.status(404).json({ error: `No project found with the id of ${projectId}.` })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
});

// One palette
app.get('/api/v1/palettes/:id', async (req, res) => {
  try {
    const paletteId = req.params.id
    const selectedPalette = await database('palettes').where('id', paletteId)
    if (selectedPalette.length) {
      res.status(200).json({ palette: selectedPalette });
    } else {
      res.status(404).json({ error: `No palette found with the id of ${paletteId}.` })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
});

// POST:
// One project
app.post('/api/v1/projects', async (req, res) => {
  try {
    const project = req.body
    if (!project.name) return res.status(422).send({ error: `Expected format: { name: <String> }` })

    database('projects').insert(project, 'id')
      .then(projectIds => {
        res.status(201).json({ id: projectIds[0] })
      })
  } catch (error) {
    res.status(500).json({ error })
  }
});

// One palette
app.post('/api/v1/palettes', async (req, res) => {
  try {
    const palette = req.body
    if (!palette.project_id || !palette.name || !palette.color1 || !palette.color2 || !palette.color3 || !palette.color4 || !palette.color5) return res.status(422).send({ error: `Expected format: { project_id: <Integer>, name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }` })

    database('palettes').insert(palette, 'id')
      .then(paletteIds => {
        res.status(201).json({ id: paletteIds[0] })
      })
  } catch (error) {
    res.status(500).json({ error })
  }
});

// PUT:
// One project
app.put('/api/v1/projects/:id', (req, res) => {
  try {
    const updates = req.body;

    database('projects').where('id', parseInt(req.params.id)).select().update(updates, 'id')
      .then(projectIds => {
        res.status(202).json({ id: projectIds[0] })
      })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// One palette
app.put('/api/v1/palettes/:id', (req, res) => {
  try {
    const updates = req.body;

    database('palettes').where('id', parseInt(req.params.id)).select().update(updates, 'id')
      .then(palettesIds => {
        res.status(202).json({ id: palettesIds[0] })
      })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// DELETE:
// One project
app.delete('/api/v1/projects/:id', (req, res) => {
  try {
    database('projects').where('id', parseInt(req.params.id)).select().delete()
      .then(projectIds => {
        res.status(202).json({ id: projectIds[0]} )
      })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// One palette
app.delete('/api/v1/palettes/:id', (req, res) => {
  try {
    database('palettes').where('id', parseInt(req.params.id)).select().delete()
      .then(palettesIds => {
        res.status(202).json({ id: palettesIds[0]} )
      })
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.listen(app.get('port'), () => {
  console.log(`Server running on port: ${app.get('port')}`);
});