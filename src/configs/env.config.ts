import * as z from "zod";

const metaEnv = import.meta.env;

const createEnv = () => {
	const EnvSchema = z.object({
		API_URL: z.url(),
		APP_URL: z.string().optional().default("http://localhost:3000"),
	});

	const envVars = Object.entries(metaEnv).reduce<Record<string, string>>(
		(acc, [key, value]) => {
			if (key.startsWith("FARM_")) {
				acc[key.replace("FARM_", "")] = value ?? "";
			}
			return acc;
		},
		{}
	);

	envVars.API_URL = envVars.API_URL || "http://localhost:8080/api";

	const parsedEnv = EnvSchema.safeParse(envVars);

	if (!parsedEnv.success) {
		throw new Error(
			`Invalid env provided.
The following variables are missing or invalid:
${Object.entries(parsedEnv.error.flatten().fieldErrors)
	.map(([k, v]) => `- ${k}: ${v}`)
	.join("\n")}`
		);
	}

	return parsedEnv.data;
};

export const env = createEnv();
