.PHONY: package
package:
	docker build -t toolbox-web:latest .

.PHONY: run
run:
	-docker stop toolbox-web
	-docker rm toolbox-web
	docker run --name toolbox-web -d -p 18080:80 --restart always toolbox-web:latest

.PHONY: all
all:
	make package
	make run

