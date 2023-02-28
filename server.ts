#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "@src/app";
import Database from "@src/app/utils/db";
import debugLogger from "debug";
import http from "http";
import { HttpError } from "http-errors";
import { AddressInfo } from "net";

/**
 * debug logs
 */

var debug = debugLogger("moviebunkers:[server.ts]");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: HttpError) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr: string | AddressInfo | null = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  /**
   * if you don't see any out put set ENV variable as
   * in windows
   * `set DEBUG=moviebunkers:*`
   * in unix
   * `export DEBUG=moviebunkers:*`
   * then it will show debug logs in terminal
   */
  // debug('Listening on ' + bind);
  debug("⚡️[server]: Server is running on " + bind);
  console.info("🚀 [server]: Server is running on " + bind);
  // connect to be
  Database.connect();
}
