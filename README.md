# Case Management

## Introduction

The Case Management project aims to deliver a Case Management solution that streamlines how cases are registered, created, and updated, enabling efficient tracking, improved data accuracy, and greater visibility across the case lifecycle.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Security

If you discover a vulnerability or have a security concern, please refer to our [Security Policy](SECURITY.md) and contact Digital.Security@cps.gov.uk.

## UI

UI is a vite react typescript project

### For fresh install:

1. Go to ui-spa folder
2. Use `npm CI` for clean install to stick with the exact packages in the package-lock.json. NOTE: dont use `npm install`

### To run locally:

1. Create and .env.local file under ui-spa and copy the contents from .env.local.example
2. make sure you have the correct env values
3. for dev build, use `npm run dev` for running the ui and you will have the dev server up and running at http://localhost:5173/
4. for prod build , use `npm run build` or building the project, then use `npm run start` and you will have the dev server up and running at http://localhost:5173/
5. to use msw and mock all the server requests when running locally, VITE_MOCK_API_SOURCE=dev,
6. to use mock auth when running localy, VITE_MOCK_AUTH=true

### To run tests:

1. To run unit tests: use `npm run test`
2. To run playwright ui integration test in browser mode: use `ui:integration`
3. To run playwright ui integration test in ci mode: use `ui:integration:ci`
