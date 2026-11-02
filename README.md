This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Run with Docker

Build Docker image from the `client` folder:

```powershell
cd client

Get-Content .env.prod | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
    Set-Item -Path "Env:$($matches[1].Trim())" -Value $matches[2]
  }
}

docker build -t cosmetic-client `
  --build-arg NEXT_PUBLIC_BACKEND_API_URL `
  --build-arg NEXT_PUBLIC_API_URL `
  --build-arg NEXT_PUBLIC_NODE_ENV `
  --build-arg NEXT_PUBLIC_LOGOUT_SECRET_KEY `
  --build-arg BACKEND_API_URL `
  --build-arg API_URL `
  .
```

Run the container:

```powershell
docker run --rm --name cosmetic-client --env-file .env.prod -p 3000:3000 cosmetic-client
```

Open `http://localhost:3000`.

If the backend runs on your host machine, use `host.docker.internal` for server-side URLs inside `.env.prod`, for example `BACKEND_API_URL=http://host.docker.internal:8080`. Browser-facing variables like `NEXT_PUBLIC_BACKEND_API_URL` can still point to `http://localhost:8080`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
