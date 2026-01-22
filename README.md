# Agent-0 | DGE Executive Platform

AI-powered executive decision support platform for the Department of Government Enablement (DGE).

## Overview

Agent-0 is an intelligent decision support system designed for government executives. It provides AI-powered briefings, decision management, workflow automation, and meeting intelligence through a modern, responsive web interface.

## Quick Start

```bash
# Navigate to the UI project
cd agent0-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:4273](http://localhost:4273) to view the application.

## Project Structure

```
agent0/
├── agent0-ui/          # Next.js frontend application
│   ├── src/
│   │   ├── app/        # Application routes and pages
│   │   ├── components/ # UI components
│   │   └── lib/        # Utilities and data
│   └── public/         # Static assets
└── vercel.json         # Deployment configuration
```

## Documentation

See [agent0-ui/README.md](./agent0-ui/README.md) for detailed documentation including:
- Features and capabilities
- Tech stack details
- Project structure
- Deployment instructions

## Deployment

The application is configured for Vercel deployment. When importing to Vercel, set the **Root Directory** to `agent0-ui`.

## License

Proprietary - Dynamiq / DGE
