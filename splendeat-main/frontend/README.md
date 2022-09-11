# SplendEat Frontend

In order to run this project, you're going to need a working installation of nodejs and npm/yarn.
[Find installation instructions here](https://nodejs.org/en/)

## Development Environment

To get the development environment up and running, start with installing the project dependencies.
In the project directory, run:

```
npm install
```

### Start as webpack

The recommended way to develop on the frontend, is to start the backend and let it forward the webpack builds.
To start the webpack engine, you can run

```console
npm run dev
```

This will automatically rebuild the frontend whenever there is a change, and send it to djangos static folder

From here, you should go see [the backend documentation](../backend/README.md)

#### Start as standalone

To start the frontend server as a standalone server, in the project directory, you can run:

```console
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Test

```console
npm test
```

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Release

```console
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
