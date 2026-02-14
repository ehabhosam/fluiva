This document is all what you need to deploy Fluiva to any machine. 

First: The one time setup. 

1. SSH into the machine. 
2. Make sure the machine is authenticated into your github.
  1. create a key
  2. take your public key 
  3. put it at keys in your github account settings. 
3. Git clone the repository. 
4. Add the environment variables:
  1. server: /server/.env
  2. frontend: /frontend/.env
5. make sure docker is installed
6. docker build images
 
Second: The Every time startup: 

1. git pull origin master
2. docker build images
3. docker compose up
4. configure nginx (after getting some domain)
