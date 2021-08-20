## Next.js with Couchbase and GraphQL

[Couchbase](https://www.couchbase.com/) is The Modern Database for Enterprise Applications. This example will show you how to connect to and use Couchbase for your Next.js app.

If you want to learn more about Couchbase, visit the following pages:

- [Couchbase Docs](https://docs.couchbase.com/)
- [Couchbase Developer Portal](https://developer.couchbase.com/)
- [Couchbase Cloud](https://cloud.couchbase.com/sign-up)

_NOTE:_ Some parts of this README have been commented out as they apply to Vercel deployment features or create-next-app features that have not yet been configured for Couchbase.

## How to use
- Clone this repo and follow configuration steps below

## Configuration

### Set up a Couchbase database

Set up a Couchbase database either locally or with [Couchbase Cloud](https://cloud.couchbase.com/sign-up).

Local installation can be accomplished through a variety of methods, but [Docker](https://docs.couchbase.com/server/current/install/getting-started-docker.html) is the simplest.

After Couchbase is installed, set up a cluster using [this tutorial](https://docs.couchbase.com/server/current/manage/manage-nodes/create-cluster.html). _NOTE:_ the **eventing** and **analytics** services can be unchecked if memory is a constraint (this is often the case with docker and other local installations).

A variety of sample buckets can be installed to get up and running with a data model quickly. We've built an example app based on the `travel-sample`. See notes on adding [sample buckets](https://docs.couchbase.com/server/current/manage/manage-settings/install-sample-buckets.html) for more info.

In order for booking functionality to work, a separate scope `bookings` will need to be created, with a `hotel` collection. 

### Set up environment variables

Copy the `env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Set each variable on `.env.local`:

- `COUCHBASE_USERNAME` - The username of an authorized user on your Couchbase instance
- `COUCHBASE_PASSWORD` - The corresponding password for the user specified above
- `COUCHBASE_ENDPOINT` - The endpoint to connect to. Use `localhost` for a local instance of Couchbase, or Wide Area Network address for a cloud instance (formatted like`<xxxxx>.dp.cloud.couchbase.com`) 
- `COUCHBASE_BUCKET` - The bucket you'd like to connect to for testing. Defaults to `travel-sample`, which works best (but must be imported, see notes on adding [sample buckets](https://docs.couchbase.com/server/current/manage/manage-settings/install-sample-buckets.html))
- `IS_CLOUD_INSTANCE` - `true` if you are trying to connect to an instance of Couchbase Cloud, `false` otherwise.

### Run Next.js in development mode

```bash
npm install
npm run dev

# or

yarn install
yarn dev
```

Your app should be up and running on [http://localhost:3000](http://localhost:3000)! If it doesn't work, post on [GitHub discussions](https://github.com/vercel/next.js/discussions).









