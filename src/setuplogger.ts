// Retrieving dependencies

import { format, transports, createLogger } from "winston";

// Setting up the logger

const logFormat = format.printf(
	(info) => `${info.level}: ${info.timestamp} [LOGS-DU-BOT]: ${info.message}`
);
const isProductionEnv =
	process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production";

if (isProductionEnv) {
	const logger = createLogger({
		defaultMeta: { service: "user-service" },
		format: format.combine(
			format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
			format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
			logFormat
		),
		transports: [
			new transports.Console({
				format: format.colorize(),
			}),
			new transports.File({
				filename: "./logs/error.log",
				//format: format.combine(format.json()),
				level: "error",
			}),
			new transports.File({
				filename: "./logs/combined.log",
				//format: format.combine(format.json()),
			}),
		],
		exitOnError: false,
	});

	console.log = logger.info.bind(logger);
	console.error = logger.error.bind(logger);
}

/*console.log = logger.log;
console.error = logger.error;*/

/*if (
	typeof process.env.NODE_ENV === "string" &&
	process.env.NODE_ENV.trim() === "production"
) {
	const logger = winston.createLogger({
		defaultMeta: { service: "user-service" },
		exitOnError: false,
		transports: [
			new winston.transports.Console({
				format: format.combine(
					format.colorize(),
					() => {}
				)
			}),
			new winston.transports.File({ filename: "./logs/combined.log" }),
		],
		format: winston.format.combine(
			winston.format.timestamp({
				format: "MMM-DD-YYYY HH:mm:ss",
			}),
			winston.format.colorize(),
			winston.format.printf(
				({ level, message, timestamp, stack }) => {
					const content = typeof message === "object" ? message : message

					return `${level}: [LOGS-DU-BOT]: ${timestamp}: ${stack || message}`
				}
			)
		),
	});

	console.log = (d) => {
		logger.info(d);
	};

	console.error = (d) => {
		logger.error(new Error(d));
	};
}
*/
