// Retrieving dependencies

import { format, transports, createLogger } from "winston";
import "winston-daily-rotate-file";

const { uncolorize, colorize, timestamp, combine, printf, label, errors, splat } = format;

// Format //

const isProductionEnv = process.env.NODE_ENV === "production";
const logFormat = printf(
	({ level, label, timestamp, message, stack }) =>
		`[BOT-${label}] ${level}: ${timestamp}: ${stack || message}`
);

// Transports //

const combinedConsoleTransport = new transports.Console();

const errorFileRotateTransport = new transports.DailyRotateFile({
	level: "error",
	format: uncolorize(),
	filename: `./logs/error/%DATE%.log`,
	datePattern: "YYYY-MM-DD",
	maxFiles: "50d",
});

const combinedFileRotateTransport = new transports.DailyRotateFile({
	format: uncolorize(),
	filename: `./logs/combined/%DATE%.log`,
	datePattern: "YYYY-MM-DD",
	maxFiles: "50d",
});

// Creating the logger instance //

const logger = createLogger({
	level: "debug",
	defaultMeta: { service: "user-service" },
	format: combine(
		colorize(),
		label({ label: isProductionEnv ? "PROD" : "DEV" }),
		timestamp({ format: "MMM-DD-YYYY (HH:mm:ss)" }),
		splat(),
		errors({ stack: true }),
		logFormat
	),
	transports: [
		combinedConsoleTransport,
		errorFileRotateTransport,
		combinedFileRotateTransport,
	],
	exitOnError: false,
});

const processLog = (level: string, [...data]) => {
	const args = data.slice();
	const str = args
		.map((x) => {
			if (x instanceof Object) {
				const prettyPrintError = (error: Error): string =>
					`${error.name} > ${error.message}\n${
						error.cause
							? typeof error.cause === "string"
								? "cause: " + error.cause
								: "cause: " +
								  prettyPrintError((error as { cause: Error }).cause)
							: error.stack
					}`;

				if (x instanceof Error) return prettyPrintError(x);
				return JSON.stringify(x, null, 4);
			}
			return x;
		})
		.join(" ");

	logger.log.apply(logger, [level, str]);
};

console.log = (...data) => processLog(isProductionEnv ? "info" : "debug", data);
console.warn = (...data) => processLog("warn", data);
console.error = (...data) => processLog("error", data);
console.debug = (...data) => processLog("debug", data);

export default logger;
