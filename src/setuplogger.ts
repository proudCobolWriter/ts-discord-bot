// Retrieving dependencies

import { format, transports, createLogger } from "winston";
import "winston-daily-rotate-file";

const { uncolorize, colorize, timestamp, combine, printf, label, errors, splat } = format;

// Format //

const isProductionEnv = process.env.NODE_ENV === "production";
const logFormat = printf(({ level, label, timestamp, message, stack }) => {
	const content =
		typeof message === "object" ? JSON.stringify(message, null, 4) : message;

	return `[BOT-${label}] ${level}: ${timestamp}: ${stack || content}`;
});

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

/*
	for (const level of Object.keys(logger.levels)) {
		if (Object.hasOwn(console, level)) {
			Object.defineProperty(console, level, (logger as any)[level].bind(logger));
		}
	}
*/

console.log = logger[isProductionEnv ? "info" : "debug"].bind(logger);
console.warn = logger.warn.bind(logger);
console.error = logger.error.bind(logger);
console.debug = logger.debug.bind(logger);

export default logger;
