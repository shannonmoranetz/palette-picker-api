const projectsData = require('../../data/example-projects');
const palettesData = require('../../data/example-palettes');

exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];
      projectsData.forEach(project => {
        projectPromises.push(createProject(knex, project))
      })
      return Promise.all(projectPromises)
    })
    .then(() => {
      let palettePromises = [];
      palettesData.forEach(palette => {
        palettePromises.push(createPalette(knex, palette))
      })
      return Promise.all(palettePromises)
    })
    .catch(error => console.log(`Seeding error: ${error}`))
};

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name
  }, 'id')
};

const createPalette = (knex, palette) => {
  return knex('palettes').insert({
    project_id: palette.project_id,
    name: palette.name,
    color1: palette.color1,
    color2: palette.color2,
    color3: palette.color3,
    color4: palette.color4,
    color5: palette.color5
  }, 'id')
};