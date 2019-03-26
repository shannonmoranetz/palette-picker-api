import request from 'supertest';
import app from './server';
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
import projects from './db/data/example-projects';

describe('Server', () => {

  beforeEach(async () => {
    await database.seed.run();
  });

  describe('Init', () => {
    it('Should return a status of 200', async () => {
      const response = await request(app).get('/');
      expect(response.status).toEqual(200);
    });

    describe('GET /api/v1/projects', () => {
      it('Should return all projects in the database', async () => {
        const numExpectedProjects = projects.length;
        const response = await request(app).get('/api/v1/projects');
        const result = response.body;
        expect(result.length).toEqual(numExpectedProjects);
      });
    });
  
    describe('GET /api/v1/projects/:id', () => {
      it('Should return a single project', async () => {
        const expectedProject = await database('projects').first();
        const id = expectedProject.id;
        const response = await request(app).get(`/api/v1/projects/${id}`);
        const result = response.body.project[0].name;
        expect(result).toEqual(expectedProject.name);
      });
  
      it('Should return an error if the project does not exist', async () => {
        const projectId = 0;
        const expectedError = `No palettes found for project with the id of ${projectId}.`;
        const response = await request(app).get(`/api/v1/projects/${projectId}/palettes`);
        const result = response.body.error;
        expect(expectedError).toEqual(result);
      });
    });
  
    describe('GET /api/v1/palettes/:id', () => {
      it('Should return a single palette', async () => {
        const expectedPalette = await database('palettes').first();
        const id = expectedPalette.id;
        const response = await request(app).get(`/api/v1/palettes/${id}`);
        const result = response.body.palette[0].color1;
        expect(result).toEqual(expectedPalette.color1);
      });
  
      it('Should return an error if the palette does not exist', async () => {
        const paletteId = 0;
        const expectedError = `No palette found with the id of ${paletteId}.`;
        const response = await request(app).get(`/api/v1/palettes/${paletteId}`);
        const result = response.body.error;
        expect(expectedError).toEqual(result);
      });
    });
  
    describe('GET /api/v1/projects/:id/palettes', () => {
      it('Should return all palettes in the database for a single project', async () => {
        const firstProject = await database('projects').first();
        const projectId = firstProject.id;
        const numExpectedPalettes = projects.find((project) => {
          return project.name === firstProject.name
        }).palettes.length;
        const response = await request(app).get(`/api/v1/projects/${projectId}/palettes`);
        const result = response.body.palettes;
        expect(result.length).toEqual(numExpectedPalettes);
      });
  
      it('Should return all palettes in the database for a project that matches the hexcode query', async () => {
        const matchingPalette = await database('palettes').where('color1', 'FFFF82');
        const firstProject = await database('projects').first();
        const projectId = firstProject.id;
        const numExpectedPalettesByHex = matchingPalette.length;
        const response = await request(app).get(`/api/v1/projects/${projectId}/palettes?hex=FFFF82`);
        const result = response.body.palettes;
        expect(result.length).toEqual(numExpectedPalettesByHex);
      });
  
      it('Should return an error if the hexcode query does not match any palettes', async () => {
        const hexcodeQuery = 'z0z19z';
        const expectedError = `No palettes found for hex code with the value of ${hexcodeQuery}.`;
        const response = await request(app).get(`/api/v1/projects/1/palettes?hex=${hexcodeQuery}`);
        const result = response.body.error;
        expect(expectedError).toEqual(result);
      });
    });
  
    describe('POST /api/v1/projects', () => {
      it('Should post a new project to the database', async () => {
        const newProject = { name: 'newMockName' };
        const response = await request(app).post('/api/v1/projects').send(newProject);
        const results = await database('projects').where('id', parseInt(response.body.id));
        const project = results[0];
        expect(project.name).toEqual(newProject.name);
      });
  
      it('Should return an error if a project does not have a name', async () => {
        const newProject = {};
        const expectedError = `Expected format: { name: <String> }`;
        const response = await request(app).post(`/api/v1/projects`).send(newProject);
        const result = response.body.error;
        expect(expectedError).toEqual(result);
      });
    });
    
    describe('POST /api/v1/palettes', () => {
      it('Should post a new palette to the database', async () => {
        const firstPalette = await database('palettes').first();
        const paletteId = firstPalette.project_id;
        const newPalette = { project_id: paletteId, name: 'newMockName', color1: 'aaaaaa', color2: 'bbbbbb', color3: 'cccccc', color4: 'dddddd', color5: 'eeeeee' };
        const response = await request(app).post('/api/v1/palettes').send(newPalette);
        const results = await database('palettes').where('id', parseInt(response.body.id));
        const palette = results[0];
        expect(palette.name).toEqual(newPalette.name);
      });
  
      it('Should return an error if a palette does not have the required values', async () => {
        const newPalette = {};
        const expectedError = `Expected format: { project_id: <Integer>, name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }`;
        const response = await request(app).post(`/api/v1/palettes`).send(newPalette);
        const result = response.body.error;
        expect(expectedError).toEqual(result);
      });
    });
  
    describe('PUT /api/v1/projects/:id', () => {
      it('Should update an existing project in the database', async () => {
        const projectToUpdate = await database('projects').first();
        const projectId = projectToUpdate.id;
        const updatesToMake = { name: 'newChangedProject' };
        await request(app).put(`/api/v1/projects/${projectId}`).send(updatesToMake);
        const result = await database('projects').where('id', projectId);
        const project = result[0];
        expect(project.name).toEqual(updatesToMake.name);
      });
  
      it('Should return an error if a project does not have the required name to update', async () => {
        const projectToUpdate = await database('projects').first();
        const projectId = projectToUpdate.id;
        const updatesToMake = {};
        const expectedError = `Expected format: { name: <String> }`;
        const response = await request(app).put(`/api/v1/projects/${projectId}`).send(updatesToMake);
        const result = response.body.error;
        expect(expectedError).toEqual(result);
      });

      it('Should return an error with a PUT to non-existent ID', async () => {
        const projectId = 0;
        const updatesToMake = { name: 'newProject' };
        const expectedError = `No project found with the id of ${projectId}.`;
        const response = await request(app).put(`/api/v1/projects/${projectId}`).send(updatesToMake);
        const result = response.body.error;
        expect(expectedError).toEqual(result);
      });

    });
  
    describe('PUT /api/v1/palettes/:id', () => {
      it('Should update an existing palette in the database', async () => {
        const paletteToUpdate = await database('palettes').first();
        const paletteId = paletteToUpdate.id;
        const updatesToMake = { color1: 'zzzzzz' };
        await request(app).put(`/api/v1/palettes/${paletteId}`).send(updatesToMake);
        const result = await database('palettes').where('id', paletteId);
        const palette = result[0];
        expect(palette.color1).toEqual(updatesToMake.color1);
      });
  
      it('Should return an error with a PUT to non-existent ID', async () => {
        const paletteId = 0;
        const updatesToMake = { color1: 'zzzzzz' };
        const expectedError = `No palette found with the id of ${paletteId}.`;
        const response = await request(app).put(`/api/v1/palettes/${paletteId}`).send(updatesToMake);
        const result = response.body.error;
        expect(expectedError).toEqual(result);
      });

      it('Should return an error if a palette does not have any data to update', async () => {
        const paletteToUpdate = await database('palettes').first();
        const paletteId = paletteToUpdate.id;
        const updatesToMake = {};
        const expectedError = `Expected format: { project_id: <Integer>, name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }`;
        const response = await request(app).put(`/api/v1/palettes/${paletteId}`).send(updatesToMake);
        const result = response.body.error;
        expect(expectedError).toEqual(result);
      });
    });
  
    describe('DELETE /api/v1/projects/:id', () => {
      it('Should delete an existing project in the database', async () => {
        const projectToDelete = await database('projects').where('name', 'Neutral colors project');
        const projectId = projectToDelete[0].id;
        await database('palettes').where('project_id', projectId).select().delete();
        await request(app).delete(`/api/v1/projects/${projectId}`);
        const deletedProject = await database('projects').where('id', projectId);
        expect(deletedProject.length).toEqual(0);
      });
  
      it('Should return an error with a DELETE to non-existent ID', async () => {
        const projectId = 0;
        const expectedError = `No project found with the id of ${projectId}.`;
        const response = await request(app).delete(`/api/v1/projects/${projectId}`);
        const result = response.body.error;
        expect(expectedError).toEqual(result);
      });
    });
  
    describe('DELETE /api/v1/palettes/:id', () => {
      it('Should delete an existing palette in the database', async () => {
        const paletteToDelete = await database('palettes').first();
        const paletteId = paletteToDelete.id;
        await request(app).delete(`/api/v1/palettes/${paletteId}`);
        const deletedPalette = await database('palettes').where('id', paletteId);
        expect(deletedPalette.length).toEqual(0);
      });
  
      it('Should return an error with a DELETE to non-existent ID', async () => {
        const paletteId = 0;
        const expectedError = `No palette found with the id of ${paletteId}.`;
        const response = await request(app).delete(`/api/v1/palettes/${paletteId}`);
        const result = response.body.error;
        expect(expectedError).toEqual(result);
      });
    });
  });
});