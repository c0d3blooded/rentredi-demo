
## API
#### Running the Project
`cd api && npm i && npm start`

Served at localhost:8080

#### Folder Structure

- **models**: object model interfaces (Typescript)
- **routes**: API routes by object
- **schema**: object model validations for API route parameters
- **services**: external resource interfaces

## App

#### Running the Project
`cd app && npm i && npm start`

Served at localhost:3000

#### Folder Structure

- **models**: object model interfaces (Typescript)
- **pages**: routes for page navigation
- **public**: media assets and resources
- **services**: external resource interfaces
- **utils**: utility functions by object type

## Notes

Includes:
- API Schema validation
- Typescript
- CORS
- Environment variables (both Express server and React app)
- Form validation
- Firebase integration
- CRUD endpoints + operations