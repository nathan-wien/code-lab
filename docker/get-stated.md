# Getting Started

from [https://docs.docker.com/get-started/](https://docs.docker.com/get-started/)

- [Getting Started](#getting-started)
  - [Part 1: Getting Start](#part-1-getting-start)
  - [Part 2: Sample Application](#part-2-sample-application)
    - [Build the app's container image](#build-the-apps-container-image)
    - [Start the app container](#start-the-app-container)
  - [Part 3: Update the application](#part-3-update-the-application)
    - [Update the source code](#update-the-source-code)
    - [Swap out the container](#swap-out-the-container)
  - [Part 5: Persist the DB](#part-5-persist-the-db)
    - [The container's filesystem](#the-containers-filesystem)
    - [Container volumes](#container-volumes)
    - [Named volume example](#named-volume-example)
    - [More details](#more-details)
  - [Part 6: Bind mounts](#part-6-bind-mounts)
    - [Start a dev-mode container](#start-a-dev-mode-container)
  - [Part 7: Multi-container apps](#part-7-multi-container-apps)
    - [Container Networking](#container-networking)
    - [Create the MySQL container](#create-the-mysql-container)
    - [Connect to the MySQL container](#connect-to-the-mysql-container)
    - [Run our app with MySQL](#run-our-app-with-mysql)
  - [Part 8: Use Docker Compose](#part-8-use-docker-compose)

## Part 1: Getting Start

```sh
$  docker run -d -p 80:80 docker/getting-started
```

* `-d`: run the container in detached mode (in the background)
* `-p 80:80`: map port 80 of the host to port 80 in the container
* `docker/getting-started`: the image to use

## Part 2: Sample Application

### Build the app's container image

* In order to build the application, we need to use a `Dockerfile`.
* A Dockerfile is a text-based script of instructions that is used to create a container image.

Dockerfile:

```dockerfile
# syntax=docker/dockerfile:1
FROM node:12-alpine
RUN apk add --no-cache python g++ make
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

* Dockerfile explained:
  1. `FROM node:12-alpine`
    * If there is no `node:12-alpine` image locally, pulls it from the configure registry (usually DockerHub).
  2. `RUN apk add --no-cache python g++ make`
    * See [reference](https://docs.docker.com/engine/reference/builder/#run) for more details.
  3. `WORKDIR /app`
    * The `WORKDIR` instruction sets the working directory for any `RUN`, `CMD`, `ENTRYPOINT`, `COPY` and `ADD` instructions that follow it in the Dockerfile. If the WORKDIR doesn’t exist, it will be created even if it’s not used in any subsequent Dockerfile instruction.
  4. `COPY . .`
    * The `COPY [--chown=<user>:<group>] <src>... <dest>` instruction copies new files or directories from `<src>` and adds them to the filesystem of the container at the path `<dest>`. See [reference](https://docs.docker.com/engine/reference/builder/#copy) for more details.
  5. `RUN yarn install --production`
     *  See [reference](https://docs.docker.com/engine/reference/builder/#run) for more details.
  6. `CMD ["node", "src/index.js"]`: specifies the default command to run when starting a container from this image.

* [RUN vs. CMD vs. ENTRYPOINT](https://stackoverflow.com/questions/37461868/difference-between-run-and-cmd-in-a-dockerfile)
 * `RUN` specifies image build steps. The state of the container after a `RUN` command will be committed to the container image.
   * A Dockerfile can have many `RUN` steps that layer on top of one another.
 * `CMD` in *exec form* and *shell form* specifies the default command the container executes when it runs. `CMD` can also specify parameters for `ENTRYPOINT`.

To build the image:

```sh
$ docker build -t getting-started .
```

* The `.` at the end of the docker build command tells that Docker should look for the Dockerfile in the current directory.


### Start the app container

```sh
$ docker run -dp 3000:3000 getting-started
```

* `-d`: detached mode
* `-p 3000:3000`: maps host's port 3000 to container's port 3000.
  * Note: only one process on the machine can listen to a specific port. For another container to use host's port 3000, we have to remove the container that is currently occupying host's port 3000.


## Part 3: Update the application

### Update the source code

* Step 1:  Update the code
* Step 2: Build the updated version of the image, using the same command as before:

```sh
$ docker build -t getting-started
```

* Step 3: Start a new contianer using the updated code. An error will occur, since there is already a container connecting to host's port 3000.

```sh
$ docker run -dp 3000:3000 getting-started
```

### Swap out the container

1. Get the ID of the container using `docker ps`.
2. Use the `docker stop` command to stop the container.

```sh
$ docker stop <container-id>
```

3. Remove the container once it has stopped:

```sh
$ docker rm <container-id>
```

4. Start the updated app.

```sh
docker run -dp 3000:3000 getting-started
```

## Part 5: Persist the DB

### The container's filesystem

When a container runs, it uses the various layers from an image for its filesystem. Each container also gets its own “scratch space” to create/update/remove files. Any changes won’t be seen in another container, even if they are using the same image.

### Container volumes

* [Volumes](https://docs.docker.com/storage/volumes/) provide the ability to connect specific filesystem paths of the container back to the host machine.
* If a directory in the container is mounted, changes in that directory are also seen on the host machine. If we mount that same directory across container restarts, we’d see the same files.
* There are 2 main types of volumes:
  * **Named volumes**
  * **Bind mounts**

### Named volume example

1. Create a volume using the `docker volume create` command:

```sh
$ docker volume create todo-db
```

2. Stop and remove the todo app which is still running without using the persistent volume.
3. Start the todo app container, but add the `-v` flag to specify a volume mount. We use the named volume and mount it to `/etc/todos`, which will capture all files created at the path.


### More details

* To check where Docker actually stores data when named volume is used, use `docker volume inspect`.


## Part 6: Bind mounts

* Named volumes are great if we simply want to store data, as we don’t have to worry about *where* the data is stored.
* With bind mounts, we control the exact mountpoint on the host.
  * We can use this to persist data, but it’s often used to provide additional data into containers.
* When working on an application, we can use a bind mount to mount our source code into the container to let it see code changes, respond, and let us see the changes right away.
  * For Node-based applications, nodemon is a great tool to watch for file changes and then restart the application. There are equivalent tools in most other languages and frameworks.


|                                              | Named Volumes               | Bind Mounts                     |
| -------------------------------------------- | --------------------------- | ------------------------------- |
| Host Location                                | Docker chooses              | You control                     |
| Mount Example (using -v)                     | `my-volume:/usr/local/data` | `/path/to/data:/usr/local/data` |
| Populates new volume with container contents | Yes                         | No                              |
| Supports Volume Drivers                      | Yes                         | No                              |

### Start a dev-mode container

To run our container to support a development workflow, we will do the following:

* Mount our source code into the container
* Install all dependencies, including the “dev” dependencies
* Start `nodemon` to watch for filesystem changes

## Part 7: Multi-container apps


### Container Networking

* **Rule**:

> If two containers are on the same network, they can talk to each other. If they aren’t, they can’t.

There are two ways to put a container on a network:
  1. Assign it at start, or
  2. Connect an existing container.


### Create the MySQL container

1. Create the network
  * We’re also going to define a few environment variables that the database will use to initialize the database (see the “Environment Variables” section in the [MySQL Docker Hub listing](https://hub.docker.com/_/mysql/)).

```sh
$ docker network create todo-app
```
2. Start a MySQL container and attach it to the network

```sh
$ docker run -d \
     --network todo-app --network-alias mysql \
     -v todo-mysql-data:/var/lib/mysql \
     -e MYSQL_ROOT_PASSWORD=secret \
     -e MYSQL_DATABASE=todos \
     mysql:5.7
```
3. Confirm we have the database up and running

```sh
$  docker exec -it <mysql-container-id> mysql -u root -p
```

### Connect to the MySQL container

We’re going to make use of the [`nicolaka/netshoot`](https://github.com/nicolaka/netshoot) container, which ships with a lot of tools that are useful for troubleshooting or debugging networking issues.

1. Start a new container using the nicolaka/netshoot image. Make sure to connect it to the same network.

```sh
$ docker run -it --network todo-app nicolaka/netshoot
```

2. Inside the container, we’re going to use the `dig` command, which is a useful DNS tool. We’re going to look up the IP address for the hostname `mysql`.

```sh
$ sh mysql
```

Example output:

```
 ; <<>> DiG 9.14.1 <<>> mysql
 ;; global options: +cmd
 ;; Got answer:
 ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 32162
 ;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

 ;; QUESTION SECTION:
 ;mysql.				IN	A

 ;; ANSWER SECTION:
 mysql.			600	IN	A	172.23.0.2

 ;; Query time: 0 msec
 ;; SERVER: 127.0.0.11#53(127.0.0.11)
 ;; WHEN: Tue Oct 01 23:47:24 UTC 2019
 ;; MSG SIZE  rcvd: 44
```

In the `ANSWER SECTION`, you will see an `A` record for `mysql` that resolves to `172.23.0.2` (your IP address will most likely have a different value). While `mysql` isn’t normally a valid hostname, Docker was able to resolve it to the IP address of the container that had that network alias (remember the `--network-alias` flag we used earlier?).

What this means is: our app only simply needs to connect to a host named mysql and it’ll talk to the database!

### Run our app with MySQL

We need a few environment variables to specify MySQL connection settings:

* `MYSQL_HOST` - the hostname for the running MySQL server
* `MYSQL_USER` - the username to use for the connection
* `MYSQL_PASSWORD` - the password to use for the connection
* `MYSQL_DB` - the database to use once connected

Note:
* While using env vars to set connection settings is generally ok for development, it is HIGHLY DISCOURAGED when running applications in production.
* A more secure mechanism is to use the secret support provided by your container orchestration framework. In most cases, these secrets are mounted as files in the running container. You’ll see many apps (including the MySQL image and the todo app) also support env vars with a `_FILE` suffix to point to a file containing the variable.

Steps:
1. Specify each of the environment variables above, as well as connect the container to the app network

```sh
$ docker run -dp 3000:3000 \
   -w /app -v "$(pwd):/app" \
   --network todo-app \
   -e MYSQL_HOST=mysql \
   -e MYSQL_USER=root \
   -e MYSQL_PASSWORD=secret \
   -e MYSQL_DB=todos \
   node:12-alpine \
   sh -c "yarn install && yarn run dev"
```

2. Look at the logs for the container (`docker logs <container-id>`). We should see a message indicating it’s using the `mysql` database.

```sh
$ nodemon src/index.js
```

* Output
```
 [nodemon] 1.19.2
 [nodemon] to restart at any time, enter `rs`
 [nodemon] watching dir(s): *.*
 [nodemon] starting `node src/index.js`
 Connected to mysql db at host mysql
 Listening on port 3000
```

3. Connect to the mysql database and prove that the items are being written to the database. Remember, the password is secret.

```sh
docker exec -it <mysql-container-id> mysql -p todos
```

## Part 8: Use Docker Compose

* Docker Compose is used to define and share multi-container applications.
* Advantage: you can define your application stack in a file, keep it at the root of your project repo (it’s now version controlled), and easily enable someone else to contribute to your project.
