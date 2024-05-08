# MedSync

MedSync is a data migration application designed for use in hospitals to facilitate the Extract, Transform, and Load (ETL) process from various databases.

## Table of Contents

1. [Introduction](#introduction)
2. [Stack](#stack)
3. [Installation](WIP)
4. [License](#license)

## Introduction

MedSync is a data migration tool developed as a part of the final paper. It aims to streamline the process of migrating data from hospitals' databases, ensuring accuracy and efficiency in the ETL process.

## Stack

MedSync is built using the following technologies:

- **Typescript**: The core programming language used for development.
- **Express JS**: A micro web framework used to build the API application.
- **Temporal**: Used for scheduling ETL tasks.
- **PostgreSQL 13**: The chosen database management system for storing migrated data.
- **Neosych API**: ETL engine to perform migration task
- **Next JS & Tauri**: Frontend framework
- **Docker**: Utilized for containerization and orchestration of the application.

## Progress

This section tracks the progress of the project, detailing the completion status of each functional requirement.

### API

- [x] Authentication
    - [x] Login
    - [x] Register
- [x] Jobs
    - [x] Create Job
    - [x] Get Jobs
    - [x] Get Job by Id 
    - [x] Get Job Statuses
    - [x] Is Job Name Available
- [x] Connections
- [x] Runs
- [x] Transformers
- [ ] Documentation
    - [x] Auth Docs
    - [ ] Job Docs
    - [ ] Connections
    - [ ] Runs Docs
    - [ ] Transformaer Docs

### Engine

- [x] Main Engine functionality
- [x] Integration with Docker

### Worker

- [x] Migration functionality
- [x] Integration with docker

### Temporal

- [x] Configuration

### Frontend

- [x] Auth 
    - [x] Login
    - [ ] Session Configuration
- [x] Dashboard
    - [x] Layout
    - [ ] Jobs
    - [ ] Connections
    - [ ] Runs
    - [ ] Transformers
- [x] Integration with API endpoints

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.