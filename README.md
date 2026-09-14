# Simple Flow Board

Build a clean Mini Kanban Board web application called "FlowBoard".

The board has exactly three columns:

- Todo

- In Progress

- Done

Each task should contain:

- id

- title

- description

- status

The user should be able to:

- View all tasks organized by status

- Create a task

- Edit an existing task

- Delete a task

- Move a task between Todo, In Progress, and Done

Create a clean and responsive interface. Keep the design simple and professional.

Do not spend unnecessary complexity on animations or advanced visual effects.

IMPORTANT ARCHITECTURE REQUIREMENT:

Centralize every backend-related operation in one service layer.

React components must NOT directly make backend/API calls and should not directly manage the mock data source.

Expose clear service operations such as:

- getTasks()

- createTask()

- updateTask()

- deleteTask()

Create a mock implementation of the service layer so that the entire application works without a real backend.

The mock implementation should simulate asynchronous backend operations.

Keep the service interface separate from the mock implementation so that later the mock can be replaced with a real HTTP implementation without rewriting the React UI.

Add tests for important service behavior and important frontend functionality.

Do NOT create:

- a real backend

- a database

- Supabase

- Firebase

- authentication

- serverless functions

For this stage the architecture must remain:

React UI

    ↓

Service Layer

    ↓

Mock Service

    ↓

Fake/local data

Later we will derive an OpenAPI specification from this service contract and implement a Python FastAPI backend separately.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4c44c184-01e5-4447-955d-dcf56e26abc2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
