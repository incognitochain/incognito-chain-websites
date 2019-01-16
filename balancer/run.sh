VERSION="0.0.2"
CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

if [[ $(docker ps -a -q --format {{.Names}} | grep constant-nginx) ]]; then
  docker stop constant-nginx > /dev/null
  docker rm constant-nginx --force > /dev/null
fi

if [[ $(docker images --format "{{.Repository}}:{{.Tag}}" | grep constant-nginx:${VERSION} ) ]]; then
  echo "Docker constant-nginx:${VERSION} was built"
else
  docker build -t constant-nginx:${VERSION} ${CURRENT_DIR}
fi

docker run -d --name constant-nginx -p 80:80 constant-nginx:${VERSION}
