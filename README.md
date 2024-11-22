
# TypeScript Project Setup

This project is a TypeScript-based application that is compiled using `tsc` (TypeScript Compiler). The compiled output can be opened in a web browser by referencing the `index.html` file.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (version 12 or later) - [Download Node.js](https://nodejs.org/)
- **TypeScript** - can be installed globally or locally in the project

You can check if you have `Node.js` and `npm` installed by running the following commands in your terminal:

```bash
node -v
npm -v
```

If not installed, please follow the instructions to install them from the official website.

## Steps to Run the Project

Follow these steps to set up and run the project on your local machine.

### 1. Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/imshm/google-clone-forms-ts
cd google-clone-forms-ts
```

### 2. Compile TypeScript Code

The TypeScript code needs to be compiled into JavaScript using the `tsc` (TypeScript Compiler). You can run the following command to compile the code:

```bash
npx tsc
```

This will transpile all TypeScript files in the `src` directory and place the output JavaScript files into the `dist` directory, as defined in the `tsconfig.json`.

### 3. Open the `index.html` in Browser

Once the TypeScript code is compiled, you can open the `index.html` file in your browser to see the result.

- Navigate to the `dist` directory where the compiled files are located.
- Open the `index.html` file in your browser. You can usually do this by double-clicking the file.

### 4. (Optional) Run a Development Server

For a more convenient development experience, you can run a local server to serve the project with live reloading.

#### Install a Local Server

For example, you can install `lite-server` as a development dependency:

```bash
npm install --save-dev lite-server
```

#### Add Start Script to `package.json`

Add the following script to your `package.json` file to start the server:

```json
"scripts": {
"start": "lite-server"
}
```

#### Run the Development Server

Start the server by running:

```bash
npm start
```

This will open the project in your default web browser and automatically reload the page when you make changes to the files.

## Project Structure

Here’s an overview of the project structure:

```
/project-root
  ├── dist/            # Compiled JavaScript files and final output
  ├── src/             # TypeScript source files
  ├── index.html       # HTML entry file
  ├── tsconfig.json    # TypeScript configuration
  └── package.json     # Project dependencies and scripts
```

## TypeScript Configuration

The `tsconfig.json` file is configured with the following options:

- `target: "es2017"`: Compiles to ECMAScript 2017 for `Object.entries` support.
- `module: "es6"`: Uses ES6 modules.
- `outDir: "./dist"`: The compiled JavaScript files will be placed in the `dist` directory.
- `rootDir: "./src"`: The TypeScript source files are located in the `src` directory.
- `strict: true`: Enables strict type-checking options for more robust type checking.
- `esModuleInterop: true`: Allows default imports from CommonJS modules.
- `lib: ["es2017", "dom"]`: Includes the ES2017 and DOM library for better environment support.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
