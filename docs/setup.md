# Setup

The components for this currently run independently of the validator and miner scripts. For validators there is [`compose-validator.yml`](../compose-validator.yml) and for miners there is [`compose-miner.yml`](../compose-miner.yml).

> [!NOTE]
> This guide is meant to be subnet-agnostic. Participating subnets that use _Lucid_ will likely have their own setup instructions and environment variables. Consult a subnet's documentation and/or discord channel for more specific setup details.

## Both Validators and Miners

First, make sure you have Docker installed and setup.

If you are on Windows, please follow [the official docs](https://docs.docker.com/desktop/install/windows-install/).

For Mac, please follow [these docs](https://docs.docker.com/desktop/install/mac-install/).

For Linux, depending on your distro, you can follow either the [official docs](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) or [these docs](https://docs.sevenbridges.com/docs/install-docker-on-linux)

You can also try typing `docker` into your terminal and it may recommend a package manager to install docker.

### Environment Variables

Both `.env.testnet` and `.env` files should have the same environment variables. The actual values should be provided by your subnet.

```txt
...
# common
CLUSTER_SECRET=""
SWARM_SECRET=""
LEADER_IPFS_MULTIADDR=""
LEADER_IPFS_CLUSTER_MULTIADDR=""
LEADER_IPFS_CLUSTER_ID=""
LISTENER_ARGS=""
BT_DIR=""

# validator-only
INSCRIBER_ARGS=""
...
```

Description of environment variables:

| Variable                        | Description                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CLUSTER_SECRET                  | The secret used to encrypt the IPFS Cluster.                                                                                                                                                                                                                                                |
| IPFS_SWARM_KEY                  | The key used to encrypt the IPFS Swarm.                                                                                                                                                                                                                                                     |
| LEADER_IPFS_MULTIADDR           | The multiaddress of the IPFS leader.                                                                                                                                                                                                                                                        |
| LEADER_IPFS_CLUSTER_MULTIADDR   | The multiaddress of the IPFS Cluster leader.                                                                                                                                                                                                                                                |
| LEADER_IPFS_CLUSTER_ID          | The ID of the IPFS Cluster leader.                                                                                                                                                                                                                                                          |
| LISTENER_ARGS                   | The arguments passed to the listener service. Make sure to replace `<NETUID>` with the correct netuid and change the `--ws-url` endpoint if needed. Running with `--log-level verbose` will show additional logs/information.                                                               |
| INSCRIBER_ARGS (validator-only) | The arguments passed to the inscriber service. Make sure to replace `<YOUR_COLDKEY>` with your bittensor wallet name and `<YOUR_HOTKEY>` with your bittensor hotkey name. Also make sure to set the correct `<NETUID>` in the `--netuid` flag and update the `--ws-url` endpoint if needed. |

### Firewall Setup

Make sure to expose the swarm ports for both IPFS and IPFS Cluster.

| Service                        | Port  |
| ------------------------------ | ----- |
| IPFS                           | 4001  |
| IPFS Cluster                   | 9096  |
| Lite node (if running locally) | 30333 |

Here's a snippet to set that up if you use ufw:

```bash
# Allow IPFS Swarm port
sudo ufw allow 4001/tcp

# Allow IPFS Cluster Swarm port
sudo ufw allow 9096/tcp

# Allow Lite node port (if running locally)
sudo ufw allow 30333/tcp

# Enable the firewall if it's not already active
sudo ufw enable
```

Everything else can be walled off as normal (other than your axon port(s) of course)

## Validator

To run, use the following command:

```bash
docker compose -f compose-validator.yml up --build -d
```

If you would like to run with a lite node (mainnet), you can run the following command:

```bash
docker compose -f compose-validator.yml --profile mainnet-lite up -d
```

To use a custom env file (e.g. `.env.testnet`), you can run the following command:

```bash
docker compose -f compose-validator.yml --env-file CUSTOM_ENV_FILE up --build -d
```

To view logs, use:

```bash
docker compose -f compose-validator.yml logs -f -n=250
```

To stop (adding `--profile mainnet-lite` if you are running with a lite node), use:

```bash
docker compose -f compose-validator.yml [--profile mainnet-lite] down
```

## Miner

> [!NOTE]
> If you run multiple miners on the same machine, you only need to setup these services once. They can each use the same IPFS node and IPFS Cluster Follower node to validate and list pins.

To run, use the following command:

```bash
docker compose -f compose-miner.yml up --build -d
```

If you would like to run with a lite node (mainnet), you can run the following command:

```bash
docker compose -f compose-miner.yml --profile mainnet-lite up -d
```

To view logs, use:

```bash
docker compose -f compose-miner.yml logs -f -n=250
```

To stop (adding `--profile mainnet-lite` if you are running with a lite node), use:

```bash
docker compose -f compose-miner.yml [--profile mainnet-lite] down
```

## Validate Setup

See if you can query the IPFS REST API locally using:

```bash
curl http://127.0.0.1:5001/api/v0/version
```

You should see something like:

```json
{
  "Version": "0.31.0-dev",
  "Commit": "a178307",
  "Repo": "16",
  "System": "amd64/linux",
  "Golang": "go1.22.7"
}
```

See if you can query the IPFS Cluster REST API locally using:

```bash
curl http://127.0.0.1:9096/api/v0/version
```

You should see something like:

```json
{ "version": "1.1.1+gita5dab45c1e241167aaf0adc8a9a0740108a755e0" }
```

## Useful Docker Commands

```bash
# check existing docker process
docker ps

# check logs of compose file
docker compose -f FILE logs -f -n=NUMLINES

# get into a container
docker exec -it NAME sh

# view live stats
docker stats
```
