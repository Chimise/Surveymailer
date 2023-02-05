import Channels from "pusher";

const key = process.env.PUSHER_PUBLIC_KEY!;
const secret = process.env.PUSHER_SECRET_KEY!;
const cluster = process.env.PUSHER_CLUSTER!;
const appId = process.env.PUSHER_APP_ID!;

const channels = new Channels({
  key,
  secret,
  cluster,
  appId,
});

export default channels;
