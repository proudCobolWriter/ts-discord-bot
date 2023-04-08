import process from "node:process";

export default (): void => {
	process.on("unhandledRejection", (reason: Error | string): void => {
		console.log("Unhandled rejection detected :");
		console.error(reason);
	});
};
