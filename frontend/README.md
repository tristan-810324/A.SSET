# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

The registration, login, and OTP flows also require the API to be running. In a
second terminal, start it from the backend folder:

```bash
cd ../backend
npm run dev
```

Confirm that `http://localhost:3000/health` returns `{"status":"ok"}` before
submitting the registration form.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## GitHub Copilot custom agent

This repository includes the `asset101` custom agent in
`../.github/agents/asset101.agent.md`. Open the repository in VS Code with
GitHub Copilot enabled, choose **asset101** from the Chat agent picker, and
describe the module or workflow you want to build.

The agent first creates a scope and implementation plan, asks for decisions
when product or architecture requirements are ambiguous, then implements and
reports frontend, API, security, and test verification. It does not assume a
backend framework or database; those choices must be agreed before backend
work is added.
