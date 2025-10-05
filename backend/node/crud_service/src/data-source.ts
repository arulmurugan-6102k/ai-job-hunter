import "reflect-metadata";
import { DataSource } from "typeorm";
import { Company } from "./entities/Company";
import { Job } from "./entities/Job";
import { JobHighlight } from "./entities/JobHighlight";
import { Skill } from "./entities/Skill";
import { User } from "./entities/User";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || "arulmurugan",
    password: process.env.DB_PASSWORD || "secret",
    database: process.env.DB_DATABASE || "ai_job_hunt",
    synchronize: process.env.NODE_ENV === "development",
    loggin: process.env.NODE_ENV === "development",
    entities: [Company, Job, JobHighlight, Skill, User],
    migration: ["src/migration/*.ts"],
    subscribers: ["src/subscribers/*.ts"],
});


