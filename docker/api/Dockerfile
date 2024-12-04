FROM maven:3.8.3-openjdk-17 AS build
WORKDIR /app
COPY geoweb-api/src /app/src
COPY geoweb-api/pom.xml /app
RUN mvn clean package -DskipTests=true

FROM eclipse-temurin:17-jdk-jammy
WORKDIR /opt/app
RUN groupadd -r javauser && useradd --no-log-init -r -g javauser javauser
COPY --from=build /app/target/*.jar app.jar
RUN chown -R javauser:javauser .
USER javauser
EXPOSE 8080
USER root
RUN apt update
RUN apt -y install software-properties-common
#RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt update
#RUN apt install python3.6
RUN add-apt-repository ppa:ubuntugis/ppa
RUN apt-get update
RUN apt -y install gdal-bin
RUN apt -y install libgdal-dev
RUN export CPLUS_INCLUDE_PATH=/usr/include/gdal
RUN export C_INCLUDE_PATH=/usr/include/gdal
#RUN pip install GDAL
#RUN gdalinfo --version
ENTRYPOINT ["java", "-jar", "app.jar"]