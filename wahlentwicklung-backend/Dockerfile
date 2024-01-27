# Stage 1: Build the application
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Install Maven
RUN apt-get update && \
    apt-get install -y maven

COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
COPY /app/src/main/resources/application.properties ./src/main/resources/
RUN mvn package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/src/main/resources/application.properties ./application.properties
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar","--spring.config.location=application.properties"]
# Note: --supaase.service.key= && --supabase.url=