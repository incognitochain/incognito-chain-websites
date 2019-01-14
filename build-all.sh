cat ./keys/gitlab-push-images.key | docker login registry.gitlab.com -u 0xbatutut --password-stdin

cwd=$(pwd)
VERSION=$(date +%Y%m%d%H%M%S)

cd $cwd
cd auth
yarn install
yarn build
yarn push ${VERSION}

cd $cwd
cd exchange
yarn install
yarn build
yarn push ${VERSION}

cd $cwd
cd explorer
yarn install
yarn build
yarn push ${VERSION}

cd $cwd
cd portal
yarn install
yarn build
yarn push ${VERSION}

cd $cwd
cd balancer.prod
yarn push ${VERSION}

cd $cwd
echo ${VERSION} > ./version
