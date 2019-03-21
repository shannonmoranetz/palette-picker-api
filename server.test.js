import request from 'supertest';
import app from './server';
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
import projects from './db/data/example-projects';

describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run()
  });
  describe('Init', () => {
    it('Should return a status of 200', async () => {
      const response = await request(app).get('/');
      expect(response.status).toEqual(200);
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
      const matchingPalette = await database('palettes').where('color1', 'a12345');
      const firstProject = await database('projects').first();
      const projectId = firstProject.id;
      const numExpectedPalettesByHex = matchingPalette.length;
      const response = await request(app).get(`/api/v1/projects/${projectId}/palettes?hex=a12345`);
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
    it('Should return an error if the project does not exist', async () => {
      const projectId = 8;
      const expectedError = `No palettes found for project with the id of ${projectId}.`;
      const response = await request(app).get(`/api/v1/projects/${projectId}/palettes`);
      const result = response.body.error;
      expect(expectedError).toEqual(result);
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