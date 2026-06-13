# Stage 1: Build the JAR
FROM gradle:8.5-jdk17 AS build
WORKDIR /home/gradle/project
COPY . .
RUN gradle clean build -x test --no-daemon

# Stage 2: Run the JAR
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /home/gradle/project/build/libs/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
