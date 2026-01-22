# Agent-0 | DGE Executive Platform

An AI-powered executive decision support platform built for the Department of Government Enablement (DGE). Agent-0 provides intelligent briefings, decision management, and workflow automation for government executives.

## Features

- **Executive Assistant** - AI-powered chat interface for briefings, email drafting, and scheduling
- **Decision Management** - Track, approve, and route decisions with confidence scoring
- **Meeting Intelligence** - Automated meeting briefs and action item tracking
- **Workflow Automation** - Configurable decision policies and routing rules
- **Multi-persona Views** - Chairman, Chairman's Office, Operations, and Admin interfaces

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS v4, Radix UI
- **3D Elements**: Three.js, React Three Fiber
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Radix Icons, Heroicons, React Icons

## Getting Started

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:4273](http://localhost:4273) to view the application.

### Available Scripts

```bash
npm run dev      # Start development server (port 4273)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin configuration views
│   ├── chairman/          # Chairman (simplified) views
│   ├── chairman-office/   # Chairman's Office (detailed) views
│   ├── operations/        # Operations/PMO views
│   └── page.tsx           # Home/persona selection
├── components/
│   ├── shared/            # Shared business components
│   └── ui/                # Base UI components (shadcn/ui style)
└── lib/
    ├── mock-data/         # Mock data for development
    ├── types/             # TypeScript type definitions
    └── utils.ts           # Utility functions
```

## Deployment

### Vercel (Recommended)

1. Import the repository in [Vercel Dashboard](https://vercel.com/new)
2. Set the **Root Directory** to `agent0-ui`
3. Deploy - Vercel will auto-detect Next.js settings

### Manual Deployment

```bash
# Build the application
npm run build

# The output will be in the .next directory
# Use any Node.js hosting platform that supports Next.js
```

### Environment Variables

Currently, the application uses mock data and doesn't require environment variables. See `.env.example` for future configuration options when backend integration is implemented.

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

## License

Proprietary - Dynamiq / DGE
