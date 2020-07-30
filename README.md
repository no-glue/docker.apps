Load balance multiple Docker containers using Nginx
---------------------------------------------------

- This example lists a NodeJs application.
- Multiple containers running NodeJs application.
- NGINX used to load balance requests.
  
A sample NodeJs app
-------------------

    // a sample NodeJs app
    var http = require('http');
    var fs = require('fs');

    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      process.env.MESSAGE++;
      res.end(`<h1>${process.env.MESSAGE}</h1>`);
    }).listen(8080);
  
A sample configuration for load balancer
----------------------------------------

    # nginx.conf
    # balance requests round robin
    upstream my-app {
        server 172.17.0.1:8081 weight=1;
        server 172.17.0.1:8082 weight=1;
        server 172.17.0.1:8083 weight=1;
    }

    server {
        location / {
            proxy_pass http://my-app;
        }
    }
  
A sample Docker file for app
----------------------------

    # prepare app to dockerize
    FROM node
    RUN mkdir -p /usr/src/app
    COPY index.js /usr/src/app
    EXPOSE 8080
    CMD [ "node", "/usr/src/app/index" ]
  
A sample Docker file for load balancer
--------------------------------------

    # prepare load balancer to dockerize
    FROM nginx
    RUN rm /etc/nginx/conf.d/default.conf
    COPY nginx.conf /etc/nginx/conf.d/default.conf

A sample of shell commands to run multiple apps
-----------------------------------------------

    # run multiple apps
    docker run -e "MESSAGE=First instance" -p 8081:8080 -d load-balanced-app
    docker run -e "MESSAGE=Second instance" -p 8082:8080 -d load-balanced-app
    docker run -e "MESSAGE=Third instance" -p 8083:8080 -d load-balanced-app

A sample shell command to run load balancer
-------------------------------------------

    # run load balancer
    docker run -p 8080:80 -d load-balance-nginx
