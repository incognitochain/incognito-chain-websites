VERSION=$1
REGISTRY=registry.gitlab.com/ninjadotorg
PROJECT=constant-websites
IMAGE=auth-dev
DOCKERFILE=.

docker build -t ${REGISTRY}/${PROJECT}/${IMAGE}:${VERSION} ${DOCKERFILE}
docker push ${REGISTRY}/${PROJECT}/${IMAGE}:${VERSION}
