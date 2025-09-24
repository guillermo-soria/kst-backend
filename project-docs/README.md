# Project Documentation

This document provides a comprehensive overview of the KST e-commerce project, including its structure, key components, and important scripts.

## Project Structure

The project is a monorepo containing two main workspaces:

-   **`backend`**: A MedusaJS server that handles all e-commerce logic.
-   **`frontend`**: A Next.js application that serves as the storefront.

### Key Files and Directories

-   **`package.json`**: The root `package.json` file defines workspaces and project-wide scripts.
-   **`backend/package.json`**: Contains scripts and dependencies for the MedusaJS backend.
-   **`frontend/package.json`**: Contains scripts and dependencies for the Next.js frontend.
-   **`backend/medusa-config.ts`**: The main configuration file for the MedusaJS server.
-   **`scripts/`**: A directory with various utility and administrative scripts.

## Important Scripts

The following scripts are crucial for managing the project:

-   **`npm run dev`**: Starts both the backend and frontend in development mode.
-   **`npm run build`**: Builds the backend for production.
-   **`npm run start`**: Starts the backend in production mode.
-   **`npm run railway:start`**: A specialized script for deploying the backend on Railway, which handles migrations and server startup.
-   **`npm run db:migrate`**: Runs database migrations for the backend.

## Deployment

The project is configured for deployment on Railway. The `railway:start` script in `backend/package.json` is the entry point for the deployment process. It ensures the admin build exists, runs database migrations, and starts the Medusa server.

## Troubleshooting

-   **Redis Connection Errors**: If you encounter Redis connection errors, it might be due to the server starting before Redis is fully ready. The `railway:start` script includes delays to mitigate this issue.
-   **Admin Build Not Found**: This error can be misleading. It often indicates an underlying problem during the server's boot process, such as a failed database or Redis connection.

This documentation should help you navigate the project and understand its key components.
