import type { ConfigData } from "./configTypes";

export default <ConfigData>{
	welcomeMessageSettings: {
		enable: true,
		messages: [
			{
				embeds: [
					{
						color: 0xed4245,
						description:
							"Bonjour %tag_user%, bienvenue au **Cercle Richelieu** !\n\nPour accéder au reste du serveur, vous devez passer l’entretien d’admission.\n🎙️ *L'entretien se passe uniquement en vocal.*\n\n🗓️ *Veuillez indiquer dans ce salon vos disponibilités pour cet entretien.*\n\nEn attendant, je vous encourage à consulter notre #𝐂𝐇𝐀𝐑𝐓𝐄",
					},
				],
				guild: "778278393807503364",
				channel: "778278394299285516",
				typingDuration: 3,
			},
		],
	},
	voiceAutoroleSettings: {
		enable: true,
		rules: [
			{
				channel: "1093993922948247635",
				role: "792340805195923457",
				guild: "778278393807503364",
			},
			{
				channel: "1094008265920221204",
				role: "1096416454800322641",
				guild: "778278393807503364",
			},
		],
		purgeInterval: {
			minutes: 15,
		},
	},
	presenceSettings: {
		enable: true,
		presences: [
			{
				activities: [
					{
						name: "Channels: %channel_count%",
						type: 0,
					},
				],
				status: "online",
				retrieveGuildInfo: {
					guild: "778278393807503364",
					entries: ["%channel_count%", "%member_count%", "%role_count%"],
				},
			},
			{
				activities: [
					{
						name: "Members: %member_count%",
						type: 1,
					},
				],
				status: "dnd",
				retrieveGuildInfo: {
					guild: "778278393807503364",
					entries: ["%channel_count%", "%member_count%", "%role_count%"],
				},
			},
			{
				activities: [
					{
						name: "Roles: %role_count%",
						type: 2,
					},
				],
				status: "idle",
				retrieveGuildInfo: {
					guild: "778278393807503364",
					entries: ["%channel_count%", "%member_count%", "%role_count%"],
				},
			},
		],
		cycleInterval: {
			minutes: 5,
		},
	},
};
