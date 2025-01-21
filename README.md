This is a simple contact book created with [Next.js](https://nextjs.org) .
With simple CRUD functions.

You can create a new contact, edit a existing contact or delete the contacts.

## Getting Started

clone the project.

go to project directory.

Install Node Packages:

```bash
npm install
```

## Install Docker Image

go to the project directory and run:

```bash
docker-compose up -d
```
This download the necessary images from docker and create a container where the mongo database and mongo-express are inside.

## Run Application

Then, run the development server:

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

## Fill database with some contacts

If you don´t want to fill some contacts for your one, you have the possibility to add ten contacts just with an API call.

You can call [http://localhost:3000/api/fillDB](http://localhost:3000/api/fillDB). This endpoint add 10 contacts to the database.



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

You can test a live Version with AtlasDB here :
[Live Version](https://nextjs-contactlog.vercel.app/)
