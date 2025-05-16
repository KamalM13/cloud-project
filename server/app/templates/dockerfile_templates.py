"""Common Dockerfile templates for different use cases."""

DOCKERFILE_TEMPLATES = {
    "python": {
        "name": "Python Application",
        "template": """FROM python:3.9-slim

WORKDIR /app

# Create default app files
RUN echo "flask==2.0.1\\nrequests==2.26.0" > requirements.txt && \\
    echo 'from flask import Flask\\n\\napp = Flask(__name__)\\n\\n@app.route(\"/\")\\ndef hello():\\n    return \"Hello from Docker!\"\\n\\nif __name__ == \"__main__\":\\n    app.run(host=\"0.0.0.0\", port=5000)' > app.py

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "app.py"]
""",
        "description": "Python application template with Flask web server",
    },
    "node": {
        "name": "Node.js Application",
        "template": """FROM node:16-alpine

WORKDIR /app

# Create default app files
RUN echo '{"name":"app","version":"1.0.0","description":"Node.js app","main":"index.js","scripts":{"start":"node index.js"},"dependencies":{"express":"^4.17.1"}}' > package.json && \\
    echo 'const express = require(\"express\");\\nconst app = express();\\nconst PORT = process.env.PORT || 3000;\\n\\napp.get(\"/\", (req, res) => {\\n  res.send(\"Hello from Docker!\");\\n});\\n\\napp.listen(PORT, () => {\\n  console.log(`Server running on port ${PORT}`);\\n});' > index.js

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
""",
        "description": "Node.js application template with Express web server",
    },
    "nginx": {
        "name": "Nginx Web Server",
        "template": """FROM nginx:alpine

# Create default nginx configuration
RUN echo 'server {\\n    listen 80;\\n    server_name localhost;\\n    location / {\\n        root /usr/share/nginx/html;\\n        index index.html;\\n    }\\n}' > /etc/nginx/conf.d/default.conf

# Create default index.html
RUN echo '<!DOCTYPE html>\\n<html>\\n<head>\\n<title>Welcome to nginx in Docker!</title>\\n</head>\\n<body>\\n<h1>Hello from Nginx!</h1>\\n<p>If you see this page, the nginx web server is successfully running in a Docker container.</p>\\n</body>\\n</html>' > /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
""",
        "description": "Nginx web server template with default configuration",
    },
    "postgres": {
        "name": "PostgreSQL Database",
        "template": """FROM postgres:13

ENV POSTGRES_DB=myapp
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Create default initialization script
RUN mkdir -p /docker-entrypoint-initdb.d && \\
    echo "CREATE TABLE IF NOT EXISTS example (id SERIAL PRIMARY KEY, name VARCHAR(100), created_at TIMESTAMP DEFAULT NOW());" > /docker-entrypoint-initdb.d/init.sql && \\
    echo "INSERT INTO example (name) VALUES ('Example Record');" >> /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432
""",
        "description": "PostgreSQL database template with default initialization",
    },
    "redis": {
        "name": "Redis Cache",
        "template": """FROM redis:alpine

# Create default redis configuration
RUN echo "bind 0.0.0.0\\nport 6379\\nprotected-mode yes" > /usr/local/etc/redis/redis.conf

EXPOSE 6379

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
""",
        "description": "Redis cache server template with default configuration",
    },
}
