This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# FastBeeTech Client

This is the **client** (frontend) application for the FastBeeTech project. It is built with [Next.js](https://nextjs.org/) and TypeScript, and is designed for modern, scalable web development.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Next.js 14+ with App Router
- TypeScript support
- Modular component structure
- API integration (see `src/api/`)
- Blog content via MDX (see `content/blog/`)
- Custom hooks and utilities
- ESLint and Prettier for code quality

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/abiolafasanya/fastbeetech.git
   cd fastbeetech/client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and fill in the required values (if `.env.example` is not present, ask the project maintainer for required variables).

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build the app for production
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint

## Project Structure

```
client/
├── content/           # Blog content (MDX)
├── public/            # Static assets
├── src/
│   ├── api/           # API integration
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and libraries
│   ├── store/         # State management
│   ├── types/         # TypeScript types
│   └── ...
├── .env               # Environment variables
├── package.json       # Project metadata and scripts
├── next.config.ts     # Next.js configuration
└── ...
```

## Environment Variables

- All environment variables should be defined in the `.env` file at the root of the `client` directory.
- Example variables:
  - `NEXT_PUBLIC_API_URL` — Base URL for backend API
  - `NEXT_PUBLIC_ANALYTICS_ID` — Analytics tracking ID

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.
