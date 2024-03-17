# MedSync Connector Module

The MedSync Connector module provides connectors for various databases, allowing MedSync to interact with different database systems. Currently, it should supports connectors for PostgreSQL and MySQL databases for both source and destination.

## Introduction

The MedSync Connector module is a crucial component of the MedSync application, providing connectors to interact with source and destination databases. It enables MedSync to check connections, discover schema for specific tables, and read/write data from/to the databases seamlessly.

## Features

- **Connection Checking**: Verify connectivity to the destination database before initiating data migration tasks.
- **Schema Discovery**: Discover the schema for a specified table in the database to understand its structure.
- **Data Read/Write**: Perform data read and write operations between MedSync and the source/destination databases.
