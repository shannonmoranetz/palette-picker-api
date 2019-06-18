# Palette Picker (paLit)

## Generate color palettes for design projects (front-end)

* * *

### Randomized hex palette generation. Inspired by the web app Coolors.

![Screenshot](https://i.imgur.com/Dd5GEVZ.png)

### Demo

[Click to view live app demo](https://palit-picker.herokuapp.com) 

### Features

*   RESTful API
*   CRUD endpoints
*   HTTP Methods: GET, DELETE, POST & PUT
*   Endpoints targetable by one or all items

### Tech Stack

*   Node & Express
*   Knex
*   PostgreSQL
*   Supertest

### Installation

* Front-end:
```
https://github.com/shannonmoranetz/palette-picker
```
* Dependencies:
```
npm i
```
* Start:
```
npm start
```
* Test:
```
npm test
```

### Documentation

#### Projects ~ GET

All projects:
```
GET /api/v1/projects
```
Query by ID:
```
GET /api/v1/projects/:id
```

#### Projects ~ POST

```
POST /api/v1/projects
```
Request body requires a name. An ID will be sent back upon a successful post response.

#### Projects ~ DELETE

Delete by ID:
```
DELETE /api/v1/projects/:id
```
An ID will be sent back upon a successful deletion.

#### Projects ~ PUT

Update by ID:
```
Put /api/v1/projects/:id
```
Request body requires a name. An ID will be sent back upon a successful update.

#### Palettes ~ GET

Query by ID:
```
GET /api/v1/palettes/:id
```
Query by palettes under project ID:
```
GET /api/v1/projects/:id/palettes
```
Query project palette by hexcode:
```
GET /api/v1/projects/:id/palettes?hex=ffffff
```

#### Palettes ~ POST

Post to palettes endpoint:
```
POST /api/v1/palettes
```
Request body requires the following keys: project_id, name, color1, color2, color3, color4, color5. An ID will be sent back upon a successful post response.

#### Palettes ~ PUT

Update by ID:
```
Put /api/v1/palettes/:id
```
Request body must have at least one of the following keys: project_id, name, color1, color2, color3, color4, color5. An ID will be sent back upon a successful update.

#### Palettes ~ DELETE

Delete by ID:
```
DELETE /api/v1/palettes/:id
```
An ID will be sent back upon a successful deletion.

### Contributors

* [Shannon Moranetz](https://github.com/shannonmoranetz)
* [Heather Hartley](https://github.com/hlhartley)
