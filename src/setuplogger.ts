// Retrieving dependencies

import winston from "winston";

// Setting up the logger

if (process.env.NODE_ENV === "production") {
	const logger = winston.createLogger({
		defaultMeta: { service: "user-service" },
		exitOnError: false,
		transports: [
			new winston.transports.File({ filename: "./logs/combined.log" }),
			new winston.transports.Console(),
		],
		format: winston.format.combine(
			winston.format.timestamp({
				format: "MMM-DD-YYYY HH:mm:ss",
			}),
			winston.format.colorize(),
			winston.format.printf(
				({ level, message, timestamp, stack }: { [key: string]: string }) => {
					if (stack) {
						return `${level}: LOGS-DU-BOT: ${timestamp}: ${stack}`;
					}
					return `${level}: LOGS-DU-BOT: ${timestamp}: ${message}`;
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
