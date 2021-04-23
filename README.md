# Lambda DynamoDB REST API Demo

This project is trying to build a tiny but complete and production-ready lambda REST API service with serverless framework. The goal is to build every feature with best practices.

## Usage Instructions

> **Requirements**: NodeJS `lts/fermium (v.14)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Install packages

Run `npm i` or `yarn` to install the packages

### Testing

#### Test locally:

```bash
# test createUser function
$ sls invoke local -f createUser --path src/functions/users/mock.json

# test listUsers function
sls invoke local -f listUsers
```

#### Test Remotely

To create a user:

```bash
$ curl --location --request POST 'https://uzu36xfz2i.execute-api.ap-southeast-2.amazonaws.com/dev/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "bb1038",
    "firstName": "Benjamin",
    "lastName": "Button",
    "credentials": "badpassword",
    "email": "notarealbenjaminbutton@gmail.com"
}'

```

To list all users:

```bash
$ curl https://uzu36xfz2i.execute-api.ap-southeast-2.amazonaws.com/dev/users
```

### Deploy

Run `sls deploy` to deploy to AWS.