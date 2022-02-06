# FraggleBlock

A playground implementation of a proof of work blockchain with multiple miners competing for blocks.

## Configuration

### Database

Create the database file:

```
touch app/Database/database.json
```

Add `DB_PATH` to `.env`

```
DB_PATH="./app/Database/database.json"
```

### Pusher.js

Pusher is utilized for realtime feedback in the blockchain explorer dashboard.

Create an app with Pusher.js and add the following keys to `.env`

```
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=
PUSHER_APP_CHANNEL=
```

### Ports

The following ports are hardwired to the blockchain explorer:

> 1. 3000: Miner 1 (Express)
> 2. 3001: Miner 2 (Express)
> 3. 3002: Miner 3 (Express)
> 4. 3030: Full Node (JSON-RPC)

## Start Mining

To begin mining, first start the fullnode:

`node fullnode`

Run a separate terminal process for each miner:

```
node miner --port=3000 --miner='Miner 1'
```

```
node miner --port=3001 --miner='Miner 2'
```

```
node miner --port=3002 --miner='Miner 3'
```

Run the blockchain explorer and watch the miners compete for blocks:

```
npx parcel explorer/index.html
```
