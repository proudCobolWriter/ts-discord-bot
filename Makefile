up:
	docker compose up -d --build --force-recreate

up-dev:
	docker compose up -d --build --force-recreate

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build --force-recreate

down: 
	docker compose down