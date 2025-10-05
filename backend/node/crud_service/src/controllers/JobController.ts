import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Job } from "../entities/Job";
import { Company } from "../entities/Company";
import { Skill } from "../entities/Skils";
import { JobHighlight } from "../entities/JobHighlight";
import { CreateJobDto } from "../dto/CreateJobDto";
import { validate } from  "class-validator";
import { plainToInstance } from "class-transformers";

export class JobController {
    
}