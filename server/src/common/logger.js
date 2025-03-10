const util = require("util");
const bunyan = require("bunyan");
const PrettyStream = require("bunyan-prettystream");
const BunyanSlack = require("bunyan-slack");
const config = require("../../config");

const createStreams = () => {
  const { type, level } = config.log;
  const envName = config.env;

  const jsonStream = () => {
    return {
      name: "json",
      level,
      stream: process.stdout,
    };
  };

  const consoleStream = () => {
    const pretty = new PrettyStream();
    pretty.pipe(process.stdout);
    return {
      name: "console",
      level,
      stream: pretty,
    };
  };

  const slackStream = () => {
    const stream = new BunyanSlack(
      {
        webhook_url: config.slackWebhookUrl,
        customFormatter: (record, levelName) => {
          if (record.type === "http") {
            record = {
              url: record.request.url.relative,
              statusCode: record.response.statusCode,
              ...(record.error ? { message: record.error.message } : {}),
            };
          }
          return {
            text: util.format(`[%s][${envName}] %O`, levelName.toUpperCase(), record),
          };
        },
      },
      (error) => {
        console.log("Unable to send log to slack", error);
      }
    );

    return {
      name: "slack",
      level: "error",
      stream,
    };
  };

  const streams = type === "console" ? [consoleStream()] : [jsonStream()];

  if (config.log.streams.includes("slack") && config.slackWebhookUrl) {
    streams.push(slackStream());
  }
  return streams;
};

module.exports = bunyan.createLogger({
  name: config.appName,
  serializers: bunyan.stdSerializers,
  streams: createStreams(),
});
