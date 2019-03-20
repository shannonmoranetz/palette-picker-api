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
    it.skip('Should return all palettes in the database a project with matching params', async () => {
      const numExpectedPalettes = palettes.length;
      const response = await request(app).get('/api/v1/projects/1/palettes');
      const result = response.body;
      expect(result.length).toEqual(numExpectedPalettes);
    });
  });
});