DOCKER_REGISTRY_ID = $(word 2,$(MAKECMDGOALS))

# Предотвращаем выполнение аргумента как цели
$(DOCKER_REGISTRY_ID):
	@:

HQ_VERSION = 0.1
HQ_DOCKER_IMAGE := cr.yandex/$(DOCKER_REGISTRY_ID)/hq:$(HQ_VERSION)

image:
	@echo 'Собираем докер-образ с HQ и грузим его в registry'
	@docker buildx build --platform linux/amd64 --no-cache -f Dockerfile -t ${HQ_DOCKER_IMAGE} .
	@docker push ${HQ_DOCKER_IMAGE}
