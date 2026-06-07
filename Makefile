.PHONY: help install dev build frontend-dev frontend-build clean check

.DEFAULT_GOAL := help

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Install frontend dependencies
	npm install

dev: ## Run the app in development mode (Tauri + Vite)
	npm run tauri dev

build: ## Build production app bundle
	npm run tauri build

frontend-dev: ## Run Vite dev server only (browser)
	npm run dev

frontend-build: ## Build frontend assets only
	npm run build

check: ## Type-check the frontend
	npm run check

clean: ## Remove build artifacts and dependencies
	rm -rf dist node_modules src-tauri/target
