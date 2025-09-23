FROM eclipse-temurin:21-jdk-alpine
LABEL authors="tom"

WORKDIR /app
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]