FROM postgres:13

ENV POSTGRES_DB=myapp
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=password

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
