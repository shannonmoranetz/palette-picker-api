const projectsData = require('../../data/example-projects');
const palettesData = require('../../data/example-palettes');

exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let palettePromises = [];
      palettesData.forEach(palette => {
        palettePromises.push(createPalette(knex, palette))
      })
      return Promise.all(palettePromises)
    })
    .then(() => {
      let projectPromises = [];
      projectsData.forEach(project => {
        projectPromises.push(createProject(knex, project))
      })
      return Promise.all(projectPromises)
    })
    .catch(error => console.log(`Seeding error: ${error}`))
};
