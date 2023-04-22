import type { SimpleIntervalSchedule } from "toad-scheduler";

export interface Job {
	name: string;
	settings: SimpleIntervalSchedule;
	enabled: boolean;
	run(...args: unknown[]): Promise<void>;
}

export type { SimpleIntervalSchedule };
