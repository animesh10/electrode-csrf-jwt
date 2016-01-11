"use strict";

const Hapi = require("hapi");

const server = new Hapi.Server();
server.connection({host: "localhost", port: 3000});

const options = {
  secret: "shhhhh",
  expiresIn: 60
};

server.register({register: require("../"), options}, (err) => {
  if (err) {
    throw err;
  }
});

server.register(require("vision"), (err) => {
  if (err) {
    throw err;
  }

  server.views({
    engines: {
      html: require("handlebars")
    },
    relativeTo: __dirname,
    path: "templates"
  });

  server.route({
    method: "get",
    path: "/",
    handler: (request, reply) => {
      return reply.view("index.html", {message: "hi", jwt: request.plugins.jwt});
    }
  });

  server.route({
    method: "post",
    path: "/",
    handler: (request, reply) => {
      return reply.view("message.html", {message: request.payload.message});
    }
  });

});


server.start(() => {
  console.log(`Example server running at: ${server.info.uri}`);
});