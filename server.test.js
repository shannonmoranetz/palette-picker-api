import request from 'supertest';
import app from './server';
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
import projects from './db/data/example-projects';
import palettes from './db/data/example-palettes';

describe('Server', () => {
  describe('Init', () => {
    it('Should return a status of 200', async () => {
      const res = await request(app).get('/');
      expect(res.status).toEqual(200);
    });
  });
  describe('GET /api/v1/projects', () => {
    it('Should return all projects in the database', async () => {
      const numExpectedProjects = projects.length;
      const response = await request(app).get('/api/v1/projects');
      const result = response.body;
      expect(result.length).toEqual(numExpectedProjects);
    });
  });
  describe('GET /api/v1/projects/:id/palettes', () => {
    it('Should return all palettes in the database for a single project', async () => {
      const matchingPalettes = await database('palettes').where('project_id', 1);
      const numExpectedPalettes = matchingPalettes.length;
      const response = await request(app).get('/api/v1/projects/1/palettes');
      const result = response.body.palettes;
      expect(result.length).toEqual(numExpectedPalettes);
    });
    it.skip('Should return all palettes in the database for a project that match the hexcode query', async () => {
    });
    it.skip('Should return an error if the project does not exist', async () => {
    });
    it.skip('Should return an error if the hexcode query does not match any palettes', async () => {
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
    it.skip('Should return an error if the project does not exist', async () => {
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
    it.skip('Should return an error if the palette does not exist', async () => {
    });
  });
});