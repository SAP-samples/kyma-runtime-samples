FROM sapmachine:21.0.7-ubuntu-24.04

LABEL maintainer="Gaurav Abbi <gaurav.abbi@sap.com>"

WORKDIR /var/app

ADD sample-ldap-*.jar /var/app/sample-ldap.jar


EXPOSE 8080

CMD ["java",  "-jar",  "/var/app/sample-ldap.jar"]