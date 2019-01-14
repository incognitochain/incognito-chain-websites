docker login registry.gitlab.com -u gitlab+deploy-token-37411 -p m8_Cm2a5TvsPDrf1wp2_

VERSION=$1

sed -e "s|\${VERSION}|${VERSION}|" ./docker-compose.dev.format.yml > ./docker-compose.dev.yml

docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
