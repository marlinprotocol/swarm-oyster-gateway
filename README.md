# Swarm Oyster Gateway

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fethersphere%2Fgateway-proxy.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fethersphere%2Fgateway-proxy?ref=badge_shield)
[![](https://img.shields.io/badge/made_by-Marlin-blue)](https://www.marlin.org/)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
![](https://img.shields.io/badge/npm-%3E%3D6.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D12.0.0-orange.svg?style=flat-square)

This repository contains the codebase for the Swarm Oyster Gateway. Follow the instructions below to install and run the process.

## Prerequisites

- Docker installed
- npm (latest version) installed

## Recommended OS

- Linux or macOS
- Windows (using WSL)

## Installation and Setup

### Step 1: Clone the Repository

First, clone this repository and navigate into the directory:

```bash
git clone https://github.com/gabrielaxy/swarm-oyster-gateway
cd swarm-oyster-gateway
```

### Step 2: Install npm Packages

Install the necessary npm packages:

```bash
npm i
```

### Step 3: Create a Binary

Instead of copying and pasting the server code and then installing npm packages as part of the Docker image, which bloats the image size significantly, you can create a smaller image by packaging the server codebase into a single binary.

1. Install pkg as a development dependency:

```bash
npm i -D pkg
```

2. Create a binary using `pkg`:

```bash
npx pkg -t node14-alpine app.js
```

This creates a self-contained app binary that can be run without installing Node.js inside the enclave. The binary takes the same name as the input JS filename.

### Step 4: Build an Enclave Image with the Node.js Binary

#### Step 4.1: Create a Config File

Create a `config.json` file with the following content:

```
{
    "caddy": {
        "url": "",
        "caddyfile": ""
    },
    "params": {
    },
    "service_commands": [
        {
            "name": "node_app",
            "command": "/app/mount/app",
            "build_commands": [
                ""
            ],
            "ports": [4000],
            "env": {}
        }
    ]
}
```

#### Step 4.2: Build the Enclave Image

Make sure docker is running and build the enclave image using the following command:

```bash
sudo docker run -it --privileged -v `pwd`:/app/mount marlinorg/enclave-builder
```

This command will create enclave/enclave.eif, which is the enclave image file, and will print measurements that should look something like this:

```json
{
  "Measurements": {
    "HashAlgorithm": "Sha384 { ... }",
    "PCR0": "cfa7554f87ba13620037695d62a381a2d876b74c2e1b435584fe5c02c53393ac1c5cd5a8b6f92e866f9a65af751e0462",
    "PCR1": "bcdf05fefccaa8e55bf2c8d6dee9e79bbff31e34bf28a99aa19e6b29c37ee80b214a414b7607236edf26fcb78654e63f",
    "PCR2": "20caae8a6a69d9b1aecdf01a0b9c5f3eafd1f06cb51892bf47cef476935bfe77b5b75714b68a69146d650683a217c5b3"
  }
}
```

### Step 5: Deploy the enclave image on Oyster

#### Step 5.1: Host the image where it can be publicly downloaded

Upload the enclave.eif to a hosting service of your choice and make it publicly accessible.

Test whether the file has been correctly hosted and is publicly accessible by running

```bash
wget <eif url>
```

#### Step 5.2: Create a job
Navigate to the [marketplace](https://hub.marlin.org/oyster/marketplace/) page and select a chain of your choice in the dropdown to the top right. You will see a table filled with operators and the compute resources they offer which looks something like this:



## Maintainers

- [Gabriel](https://github.com/gabrielaxy)