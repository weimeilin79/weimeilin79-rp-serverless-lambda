# pokemon-ticket-sales

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:
```shell script
./mvnw compile quarkus:dev
```

> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at http://localhost:8080/q/dev/.

## Packaging and running the application

The application can be packaged using:
```shell script
./mvnw package
```
It produces the `quarkus-run.jar` file in the `target/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/quarkus-app/lib/` directory.

The application is now runnable using `java -jar target/quarkus-app/quarkus-run.jar`.

If you want to build an _über-jar_, execute the following command:
```shell script
./mvnw package -Dquarkus.package.type=uber-jar
```

The application, packaged as an _über-jar_, is now runnable using `java -jar target/*-runner.jar`.

## Creating a native executable

You can create a native executable using: 
```shell script
./mvnw package -Dnative
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using: 
```shell script
./mvnw package -Dnative -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./target/pokemon-ticket-sales-1.0.0-runner`



```
./mvnw quarkus:add-extension -Dextensions='container-image-docker'
```

```
./mvnw install -Dquarkus.container-image.build=true
```

```
docker run -p 8080:8080 christina/pokemon-ticket-sales:1.0.0
```


```
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/v3o0s7j1
docker tag 95d93a1ea38e public.ecr.aws/v3o0s7j1/pokemon-ticket-sales:latest
docker push public.ecr.aws/v3o0s7j1/pokemon-ticket-sales:latest

```


sudo yum update -y
sudo yum install docker
sudo usermod -a -G docker ec2-user
sudo service docker start
sudo chkconfig docker on
sudo chmod 666 /var/run/docker.sock