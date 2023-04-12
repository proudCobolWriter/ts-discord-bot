import type { SimpleIntervalSchedule } from "toad-scheduler";

export interface Job {
	name: string;
	settings: SimpleIntervalSchedule;
	run(...args: unknown[]): Promise<void>;
}

export type { SimpleIntervalSchedule };
