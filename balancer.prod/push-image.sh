VERSION=$1
REGISTRY=registry.gitlab.com/ninjadotorg
PROJECT=constant-websites
IMAGE=nginx
DOCKERFILE=.

docker build -t ${REGISTRY}/${PROJECT}/${IMAGE}:${VERSION} ${DOCKERFILE}
docker push ${REGISTRY}/${PROJECT}/${IMAGE}:${VERSION}
