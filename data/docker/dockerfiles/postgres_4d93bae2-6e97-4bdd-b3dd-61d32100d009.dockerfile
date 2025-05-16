FROM postgres:13

ENV POSTGRES_DB=myapp
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Create default initialization script
RUN mkdir -p /docker-entrypoint-initdb.d && \
    echo "CREATE TABLE IF NOT EXISTS example (id SERIAL PRIMARY KEY, name VARCHAR(100), created_at TIMESTAMP DEFAULT NOW());" > /docker-entrypoint-initdb.d/init.sql && \
    echo "INSERT INTO example (name) VALUES ('Example Record');" >> /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432
