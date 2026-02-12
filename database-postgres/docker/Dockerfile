FROM postgres:16

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY app /usr/src/app

# Grant permissions for the init-db script to be executable
RUN chmod +x /usr/src/app/init-db.sh

EXPOSE 5432

# Copy initialization script to docker-entrypoint-initdb.d
RUN cp /usr/src/app/setup.sql /docker-entrypoint-initdb.d/

CMD ["postgres"]
