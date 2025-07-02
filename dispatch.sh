#!/bin/bash
make
if [ $? -ne 0 ]; then
  echo "Make failed, please check the output above."
  exit 1
fi
docker stop toolbox-web
docker rm toolbox-web
docker run --name toolbox-web -d -p 18080:80 --restart always toolbox-web:latest