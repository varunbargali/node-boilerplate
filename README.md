# Node Boilerplate

## Setup Steps

### Environment Setup

1. Setup Node and npm using nvm

    * Install [nvm](https://github.com/creationix/nvm)

            $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.1/install.sh | bash

    * Install node and npm

            $ nvm install

    * Install yarn

            $ npm install -g yarn@1.22.5


2. Install dependencies

        $ yarn install

### Database Setup

1. Setup MongoDB 4.4.x

2. Update configurations

    Copy `./.env.template` to `./.env` and update variables as required.

### Run application

1. To run the application use command

        yarn run start

2. For local development, use

        yarn run watch

    This uses [nodemon](https://www.npmjs.com/package/nodemon) to watch files for changes and automatically restarts the Node.js application when changes are detected.

3. For linting changing, use

        yarn run lint
