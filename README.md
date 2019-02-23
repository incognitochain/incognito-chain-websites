# Constant websites

## Prerequisite

Install these first:

- Docker >= 18.0.0
- Yarn
- NodeJS

## Getting Started

- Run `yarn balancer`
- If above not work as expected, update your host file (located at `/etc/hosts` on mac) to `./balancer/hosts`
- Open each sub project (`user`, `portal`, etc.) and run `yarn install` then `yarn start`
- After running `yarn start` success, use the domain in `./balancer/hosts` to open the corresponpse constant website.
