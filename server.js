import '@babel/polyfill';
import express from 'express';
const environment = process.env.NODE_ENV || 'development';
let configuration;
if (environment === 'test') {
  configuration = require('./knexfile')[environment];
} else {
  configuration = require('../knexfile')[environment];
}
const database = require('knex')(configuration);
const app = express();
app.use(express.json());
app.set('port', process.env.PORT || 3001);

// GET:
// Root
app.get('/', async (req, res) => {
  try {
    res.send('Sucessful request completed to Palette Picker API.');
  } catch (error) {
    res.status(500).json({ error });
  }
});

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
    const selectedProject = await database('projects').where('id', projectId);
    if (selectedProject.length) {
      res.status(200).json({ project: selectedProject });
    } else {
      res.status(404).json({ error: `No project found with the id of ${projectId}.` });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// One palette
app.get('/api/v1/palettes/:id', async (req, res) => {
  try {
    const paletteId = req.params.id;
    const selectedPalette = await database('palettes').where('id', paletteId);
    if (selectedPalette.length) {
      res.status(200).json({ palette: selectedPalette });
    } else {
      res.status(404).json({ error: `No palette found with the id of ${paletteId}.` });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// POST:
// One project
app.post('/api/v1/projects', async (req, res) => {
  try {
    const project = req.body;
    if (!project.name) return res.status(422).send({ error: `Expected format: { name: <String> }` });
    const projectId = await database('projects').insert(project, 'id')
    res.status(201).json({ id: projectId[0] })
  } catch (error) {
    res.status(500).json({ error })
  }
});

// One palette
app.post('/api/v1/palettes', async (req, res) => {
  try {
    const { project_id, name, color1, color2, color3, color4, color5 } = req.body;
    if (!project_id || !name || !color1 || !color2 || !color3 || !color4 || !color5) {
      return res.status(422).send({ 
        error: `Expected format: { project_id: <Integer>, name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }` 
      })
    } 
    const paletteId = await database('palettes').insert(req.body, 'id');
    res.status(201).json({ id: paletteId[0] });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// PUT:
// One project
app.put('/api/v1/projects/:id', async (req, res) => {
  try {
    const updates = req.body;
    if (!updates.name) {
      return res.status(422).send({
        error: `Expected format: { name: <String> }`
      });
    };
    const projectToUpdate = await database('projects').where('id', parseInt(req.params.id)).select()
    if (projectToUpdate.length) {
      const projectId = await database('projects').where('id', parseInt(req.params.id)).select().update(updates, 'id')
      res.status(202).json({ id: projectId[0] })
    } else {
      res.status(404).json({ error: `No project found with the id of ${req.params.id}.` });
    }
  } catch (error) {
    res.status(500).json({ error });
  };
})

// One palette
app.put('/api/v1/palettes/:id', async (req, res) => {
  try {
    const updates = req.body;
    const paletteToUpdate = await database('palettes').where('id', parseInt(req.params.id)).select();
    if (!Object.keys(updates).length) {
      return res.status(422).send({
        error: `Expected format: { project_id: <Integer>, name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }`
      });
    };
    if (paletteToUpdate.length) {
      const updatedPalette = await database('palettes').where('id', parseInt(req.params.id)).select().update(updates, 'id');
      res.status(202).json({ id: updatedPalette[0] })
    } else {
      res.status(404).json({ error: `No palette found with the id of ${req.params.id}.` });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
})

// DELETE:
// One project
app.delete('/api/v1/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const projectToDelete = await database('projects').where('id', parseInt(req.params.id)).select();
    if (projectToDelete.length) {
      await database('projects').where('id', parseInt(req.params.id)).select().delete();
      res.status(202).json({ id: projectToDelete[0].id} );
    } else {
      res.status(404).json({ error: `No project found with the id of ${projectId}.` });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
})

// One palette
app.delete('/api/v1/palettes/:id', async (req, res) => {
  try {
    const paletteId = req.params.id;
    const paletteToDelete = await database('palettes').where('id', parseInt(req.params.id)).select();
    if (paletteToDelete.length) {
      await database('palettes').where('id', parseInt(req.params.id)).select().delete();
      res.status(202).json({ id: paletteToDelete[0].id });
    } else {
      res.status(404).json({ error: `No palette found with the id of ${paletteId}.` });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
})

app.listen(app.get('port'), () => {
  console.log(`Server running on port: ${app.get('port')}`);
});

module.exports = app;