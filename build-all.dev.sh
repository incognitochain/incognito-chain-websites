cat ./keys/gitlab-push-images.key | docker login registry.gitlab.com -u 0xbatutut --password-stdin

cwd=$(pwd)
VERSION=$(date +%Y%m%d%H%M%S)

cd $cwd
cd user
yarn install
yarn build:dev
yarn push:dev ${VERSION}

cd $cwd
cd exchange
yarn install
yarn build:dev
yarn push:dev ${VERSION}

cd $cwd
cd explorer
yarn install
yarn build:dev
yarn push:dev ${VERSION}

cd $cwd
cd portal
yarn install
yarn build:dev
yarn push:dev ${VERSION}

cd $cwd
cd balancer.prod
yarn push:dev ${VERSION}

cd $cwd
echo ${VERSION} > ./version.dev
