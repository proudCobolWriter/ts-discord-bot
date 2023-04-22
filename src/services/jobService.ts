import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";
import { type Job } from "../jobs/index.js";

const scheduler = new ToadScheduler();

export class JobService {
	constructor(private jobs: Job[]) {}

	public start(): void {
		for (const jobInfo of this.jobs) {
			if (!jobInfo.enabled) continue;

			const task = new AsyncTask(
				jobInfo.name,
				() => jobInfo.run(),
				(err) => {
					console.log(
						`Une erreur est survenue lors de l'exécution de la tâche {${jobInfo.name}} :`
					);
					console.error(err);
				}
			);

			const job = new SimpleIntervalJob(jobInfo.settings, task);

			scheduler.addSimpleIntervalJob(job);

			console.log(`Tâche "${jobInfo.name}" enregistrée`);
		}
	}

	public getScheduler(): ToadScheduler {
		return scheduler;
	}
}
