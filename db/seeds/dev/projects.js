const projectsData = require('../../data/example-projects');

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
  };

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name
  }, 'id')
    .then((projectId) => {
      let palettePromises = [];
      project.palettes.forEach(palette => {
        const { name, color1, color2, color3, color4, color5 } = palette;
        palettePromises.push(createPalette(knex, {
          project_id: projectId[0], name, color1, color2, color3, color4, color5
        }))
      })
      return Promise.all(palettePromises)
    })
    .catch(error => console.log(`Seeding error: ${error}`))
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