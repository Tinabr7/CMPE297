# CMPE297

## Introduction

Big Data Platform is a solution or bundle that consists of big data storage, database, servers, and management utilities. With the increase in size of data, the time taken to handle multiple use-cases is difficult with an unstable big data platform. This problem is solved using Sharding or scale out (horizontal scaling). Sharding is the process of breaking up large tables into smaller chunks called shards that are spread across multiple servers. This allows for higher tolerance to failures(i.e only some amount of data is lost if the server dies). Our Project aims to utilize what we learned in this class and create a scalable big data system that includes a web application and developers API. Using MongoDB as a back-end database to test query performance against the large dataset, with standalone and distributed systems using the Sharding mechanism. Doing performance analysis with expected data on the database provides a clear guideline on how we should scale our infrastructure in the future. 


## Prerequesite:
1. nodejs version 10.18 or lower for bcrypt
2. mongodb version 4.2 or lower for replication/sharding

## How to Build:
1. cd into project
2. npm install 
3. follow the docker-commands.txt to setup a mongo db clusters ( 1 router, 1 config db, and 3 mongodb)
4. follow the docker-commands.txt to setup sharding key (base on _id ) 
5. node server.js ( to start server)
6. project should run on port 6001


## Team:
1. Vu Nguyen
2. Tina Ruchandani
3. Steffin Franklin

