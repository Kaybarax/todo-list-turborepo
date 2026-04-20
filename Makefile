COLIMA_DEPLOY ?= /Users/kevin/workspace/scripts/colima-build-push-deploy.sh
REGISTRY ?= localhost:5050
NAMESPACE ?= $(shell ns=$$(kubectl config view --minify --output 'jsonpath={..namespace}' 2>/dev/null); printf '%s' "$${ns:-default}")
TAG ?= dev

.PHONY: help colima-deploy colima-deploy-web colima-deploy-api colima-deploy-mobile-web colima-registry colima-urls

help:
	@echo "Colima targets:"
	@echo "  make colima-deploy-web         Build, push, and deploy the Next.js web app"
	@echo "  make colima-deploy-api         Build, push, and deploy the NestJS API"
	@echo "  make colima-deploy-mobile-web  Build, push, and deploy the Expo web export"
	@echo "  make colima-registry           Show local registry catalog"
	@echo ""
	@echo "Common overrides:"
	@echo "  TAG=dev|sha  NAMESPACE=colima-demo  REGISTRY=localhost:5050"

colima-deploy: colima-deploy-web

colima-deploy-web:
	APP=todo-web \
	TAG=$(TAG) \
	REGISTRY=$(REGISTRY) \
	NAMESPACE=$(NAMESPACE) \
	CONTEXT=. \
	DOCKERFILE=apps/web/Dockerfile \
	PORT=3000 \
	INGRESS_HOST=todo-web.localhost \
	$(COLIMA_DEPLOY)

colima-deploy-api:
	APP=todo-api \
	TAG=$(TAG) \
	REGISTRY=$(REGISTRY) \
	NAMESPACE=$(NAMESPACE) \
	CONTEXT=. \
	DOCKERFILE=apps/api/Dockerfile \
	PORT=3001 \
	INGRESS_HOST=todo-api.localhost \
	$(COLIMA_DEPLOY)

colima-deploy-mobile-web:
	APP=todo-mobile-web \
	TAG=$(TAG) \
	REGISTRY=$(REGISTRY) \
	NAMESPACE=$(NAMESPACE) \
	CONTEXT=. \
	DOCKERFILE=apps/mobile/Dockerfile \
	BUILD_TARGET=web-production \
	PORT=80 \
	INGRESS_HOST=todo-mobile.localhost \
	$(COLIMA_DEPLOY)

colima-registry:
	curl -fsS http://$(REGISTRY)/v2/_catalog

colima-urls:
	@echo "web:        https://todo-web.localhost:30443/"
	@echo "api:        https://todo-api.localhost:30443/"
	@echo "mobile web: https://todo-mobile.localhost:30443/"
