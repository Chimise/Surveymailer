import Pusher from 'pusher-js';

const pusher_key = process.env.NEXT_PUBLIC_PUSHER_KEY!;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!;

const pusher = new Pusher(pusher_key, {
    cluster
})

export default pusher;

