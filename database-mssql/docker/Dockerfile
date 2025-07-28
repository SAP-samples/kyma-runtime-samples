FROM mcr.microsoft.com/mssql/server:2017-CU24-ubuntu-16.04

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY app /usr/src/app

# Grant permissions for the import-data script to be executable
RUN chmod +x /usr/src/app/init-db.sh

EXPOSE 1433

CMD /bin/bash ./entrypoint.sh
