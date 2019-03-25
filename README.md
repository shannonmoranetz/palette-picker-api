# Palette Picker API
## Documentation and Example Responses

### Front-End Repository:
https://github.com/hlhartley/palette-picker

### Schema:
![Schema](https://i.imgur.com/5KWJzbM.png)

### Base URL
```
GET https://palette-picker-api.herokuapp.com
```

<br/>

### Projects
#### GET
```
GET /api/v1/projects
```
A specific project can also be queried by its ID:
```
GET /api/v1/projects/:id
```
#### POST
Posts a new project to the projects endpoint.
```
POST /api/v1/projects
```
Request body requires a name to complete successful posting to the projects endpoint.
##### Response
An ID will be sent back upon a successful post response.
<br/>
###### Example response:
```
id: 10
```
#### DELETE
Deletes an existing project by its ID.
```
DELETE /api/v1/projects/:id
```
##### Response
An ID will be sent back upon a successful deletion.
<br/>
###### Example response:
```
id: 10
```
#### PUT
Updates an existing project.
```
Put /api/v1/projects/:id
```
Request body must contain a name to update the project with.
##### Response
An ID will be sent back upon a successful update.
<br/>
###### Example response:
```
id: 10
```

<br/>

### Palettes
#### GET
Search for a palette by ID:
```
GET /api/v1/palettes/:id
```
Specific palettes can be queried by their ID and limited to a certain project:
```
GET /api/v1/projects/:id/palettes
```
A hex query may be further included in the URL to complete a search for all palettes that contain the hexcode:
```
GET /api/v1/projects/:id/palettes?hex=ffffff
```
#### POST
Post a new palette to the palettes endpoint.
```
POST /api/v1/palettes
```
Request body requires the following keys: project_id, name, color1, color2, color3, color4, color5.
##### Response
An ID will be sent back upon a successful post response.
<br/>
###### Example response:
```
id: 10
```
#### PUT
Updates an existing palette.
```
Put /api/v1/palettes/:id
```
Request body must have at least one of the following keys: project_id, name, color1, color2, color3, color4, color5.
##### Response
An ID will be sent back upon a successful update.
<br/>
###### Example response:
```
id: 10
```
#### DELETE
Deletes an existing palette by its ID.
```
DELETE /api/v1/palettes/:id
```
##### Response
An ID will be sent back upon a successful deletion.
<br/>
###### Example response:
```
id: 10
```
