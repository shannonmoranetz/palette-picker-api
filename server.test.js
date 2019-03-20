import request from 'supertest';
import app from './server';
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
import projectsData from './db/data/example-projects';
import palettesData from './db/data/example-palettes';

describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run();
  });
  describe('init', () => {
    it('Should return a status of 200', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
  });
});