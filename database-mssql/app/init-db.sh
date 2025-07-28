#wait for the SQL Server to come up
sleep 60s

#run the setup script to create the DB and the schema in the DB
/opt/mssql-tools/bin/sqlcmd -S 127.0.0.1 -U sa -P "Yukon900" -d master -i setup.sql