"""Common Dockerfile templates for different use cases."""

DOCKERFILE_TEMPLATES = {
    "python": {
        "name": "Python Application",
        "template": """FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]
""",
        "description": "Basic Python application template with pip dependencies",
    },
    "node": {
        "name": "Node.js Application",
        "template": """FROM node:16-alpine

WORKDIR /app

# Create default package.json if it doesn't exist
RUN echo '{"name": "app", "version": "1.0.0", "scripts": {"start": "node index.js"}}' > package.json

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
""",
        "description": "Basic Node.js application template with npm dependencies",
    },
    "nginx": {
        "name": "Nginx Web Server",
        "template": """FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY ./static /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
""",
        "description": "Basic Nginx web server template",
    },
    "postgres": {
        "name": "PostgreSQL Database",
        "template": """FROM postgres:13

ENV POSTGRES_DB=myapp
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=password

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
""",
        "description": "PostgreSQL database template with initialization script",
    },
    "redis": {
        "name": "Redis Cache",
        "template": """FROM redis:alpine

COPY redis.conf /usr/local/etc/redis/redis.conf

EXPOSE 6379

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
""",
        "description": "Redis cache server template",
    },
}
