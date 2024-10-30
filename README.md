# Todo List Backend

This project is a backend for a Todo List application built with NestJS and PostgreSQL, created by Daniel Silva.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Cloning the Repository

To clone the repository, run the following command:

```bash
git clone https://github.com/DANIELSSF/todo-list-back.git
cd todo-list-back
```

### Installing Dependencies

Install the project dependencies using Yarn:

```bash
yarn install
```

### Setting Up the Database

To set up the PostgreSQL database, use Docker Compose:

```bash
docker-compose up -d
```

This command will start the PostgreSQL database in a Docker container.

### Running the Application

To start the NestJS application, run:

Rename file .env.template to .env 

```bash
yarn run start:dev
```

## Documentation
To read the documentation with swagger, use the following endpoint:

```
http://localhost:3001/api
```

or view documentation with postman
```
https://documenter.getpostman.com/view/20418283/2sAY4vg2eb
```

## Dependencies

This project uses the following dependencies:

- [NestJS](https://nestjs.com/): A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- [TypeORM](https://typeorm.io/): An ORM for TypeScript and JavaScript (ES7, ES6, ES5).
- [PostgreSQL](https://www.postgresql.org/): A powerful, open-source object-relational database system.
- [Docker](https://www.docker.com/): A platform for developing, shipping, and running applications in containers.

For a complete list of dependencies, refer to the `package.json` file.

## License

This project is licensed under the MIT License.
