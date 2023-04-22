// default config //
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const config: import("./configTypes").ConfigData = {
	welcomeMessageSettings: {
		enable: false,
		messages: [
			{
				message: {
					embeds: [
						{
							color: 0xed4245,
							description: "Hello %tag_user%, welcome on the server!",
						},
					],
				},
				guild: "snowflake",
				channel: "snowflake",
				typingDuration: 3,
			},
		],
	},
	voiceAutoroleSettings: {
		enable: false,
		rules: [],
		purgeInterval: {
			minutes: 15,
		},
	},
	dailyMessageSettings: {
		enable: false,
		messageList: [],
		usersAffected: [],
		checkInterval: {
			seconds: 30,
		},
		UTCtime: {
			hour: 12,
			minute: 0,
			second: 0,
		},
	},
	notificationSettings: {
		enable: false,
		youtubeRules: [
			{
				message: {
					content:
						"%author% just posted a new vid ! Check it out there !\n%link%",
				},
				youtubeChannel: "youtubeChannelID",
				discordChannel: "snowflake",
			},
		],
		queryInterval: {
			minutes: 2,
		},
	},
	presenceSettings: {
		enable: false,
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
					guild: "snowflake",
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
					guild: "snowflake",
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
					guild: "snowflake",
					entries: ["%channel_count%", "%member_count%", "%role_count%"],
				},
			},
		],
		cycleInterval: {
			minutes: 2,
			seconds: 30,
		},
	},
};

export default config;
