<!-- centered -->
<!-- <div align="center"> -->

![Lucid hero image](./assets/hero.png)

_Lucid_ aims to be a relatively simple, generic solution to address the problem of relay mining on the Bittensor network.

<!-- </div> -->

## Overview

The main ideas of _Lucid_ are:

1. **Transparency**: Miners can see all requests sent out by validators and can judge whether or not to respond to the request of a validator based on their own custom logic.
2. **Decentralization**: A private IPFS cluster with CRDT consensus is used, allowing only trusted peers to pin files to the shared filesystem. The trusted peers list is updated in real-time, with the help of the `listener` service, based on the latest inscriptions to Subtensor (`commitments` pallet) by active validators.
3. **Modularity**: These components run separately from the validator and miner processes and are decoupled from the subnet design itself. It's the job of the subnet owner to define different core pieces, such as what payload should be added to the IPFS Cluster (typically includes
   a hash and a signature by the validator) and what logic should be used to check for nearly identical requests or "fuzzy" duplicates as we like to call them.

For a more technical details, check out the [architecture doc](docs/architecture.md).

## Setup

For setup instructions, check out the [setup doc](docs/setup.md).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
