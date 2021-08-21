# RPS

![License](https://img.shields.io/github/license/calvh/mlh-final-project)
![Open
Issues](https://img.shields.io/github/issues-raw/calvh/mlh-final-project)
![Closed
Issues](https://img.shields.io/github/issues-closed-raw/calvh/mlh-final-project)
![Open
PRs](https://img.shields.io/github/issues-pr-raw/calvh/mlh-final-project)
![Closed
PRs](https://img.shields.io/github/issues-pr-closed-raw/calvh/mlh-final-project)

## About

RPS is rock, paper, scissors built with Flask, and MongoDB on the
backend, jQuery on the frontend, and SocketIO on frontend and backend.
The app is designed to be run using Docker Compose.

Play it at https://rockpaperscissors.duckdns.org/

## Description

To play anonymously:

    1. Click the *Play Anonymously* Button
    2. Click either *Play against CPU* or *Play against Human*
    3. Click on your choice of Rock, Paper, or Scissors
    4. Click the button *Play Again?* to start a new game

To play with an account:

    1. Login to an existing account or Register a new account
    2. Click either *Play against CPU* or *Play against Human*
    3. Click on your choice of Rock, Paper, or Scissors
    4. Click the button *Play Again?* to start a new game

## Deploying on a webserver

Create `.env` files using the `.env.example` files as a template and set
the variables accordingly. Most variables have the sensible default
values but some need to be set explicitly:

    ```
    # flask.env
    SECRET_KEY

    # mongo.env
    MONGO_INITDB_ROOT_USERNAME
    MONGO_INITDB_ROOT_PASSWORD
    MONGO_DB

    # nginx.env
    CERTBOT_EMAIL
    ```

If you do not already have the SSL certificates in `/etc/letsencrypt/`,
the Nginx container will automatically request them for you.

Run `docker-compose up -d` to start the app.

## Testing on localhost

Create `.env` files using the `.env.example` files as a template and set
the following variables:

    ```
    # nginx.env
    USE_LOCAL_CA=1
    DHPARAM_SIZE=512
    ```

Here, `DHPARAM_SIZE` is set to a low number to reduce the amount of time
it takes for the Nginx container to startup. In production, 2048 or
larger is
[recommended](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange).

Next, change the following specifications in `docker-compose.yaml`:

    ```
    nginx:
        image: jonasal/nginx-certbot:dev
        volumes:
            - ./nginx/localhost_conf.d:/etc/nginx/user_conf.d
    ```

Run `docker-compose up -d` and navigate to `https://localhost` once the
app has started up. Your browser will warn you of unrecognized
certificates: this is normal because the test configuration generates
[self-signed
certificates](https://github.com/JonasAlfredsson/docker-nginx-certbot/blob/master/docs/advanced_usage.md#local-ca).
Accept the warning in order to see the app.

## AWS Config

![instance](https://user-images.githubusercontent.com/18680207/130306501-54e248d4-da24-48a7-aa4d-d50977fd399f.png)
![details](https://user-images.githubusercontent.com/18680207/130306498-32df673e-b6e3-4979-9f00-95728e94ec75.png)
![networking](https://user-images.githubusercontent.com/18680207/130306502-914d8bdf-61e3-4f84-813a-f9290bc85da0.png)
![rules](https://user-images.githubusercontent.com/18680207/130306503-28bcdef2-d735-464d-97d8-1f186b98ff27.png)

## Contributors

-   [HamdiaA](https://github.com/HamdiaA)
-   [nimra200](https://github.com/nimra200)
-   [Rebecca-CYLi](https://github.com/Rebecca-CYLi)
-   [calvh](https://github.com/calvh)
