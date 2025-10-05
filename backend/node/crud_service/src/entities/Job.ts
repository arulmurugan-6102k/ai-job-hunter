import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdatedDateColumn,
    Index,
    JoinColumn
} from "typeorm";
import { Company } from "./Company";
import { JobHighlight } from "./JobHighlights";
import { Skill } from "./Skill";

@Entity("jobs")
@Index(["company_id", "location"])
@Index(["scraped_at"])

export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    job_url: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    experience: string;

    @Column({ nullable: true })
    salary: string;

    @Column()
    location: string;

    @Column({ nullable: true })
    openings: number;

    @Column({ nullable: true })
    applicants: number;

    @Column({ type: "longtext", nullable: true })
    description: string;

    @Column({ nullable: true })
    role: string;

    @Column({ nullable: true })
    industry_type: string;

    @Column({ nullable: true })
    department: string;

    @Column({ nullable: true })
    employment_type: string;

    @Column({ nullable: true })
    role_category: string;

    @Column({ nullable: true })
    ug_requirement: string;

    @Column({ nullable: true })
    pg_requirement: string;

    @Column()
    scrapped_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdatedDateColumn()
    updated_at: Date;

    @ManyToOne(() => Company, company => company.jobs, { onDelete: "CASCADE"})
    @JoinColumn({ name:  "company_id" })
    company : Company;

    @OneToMany(() => JobHighlight, highlight => highlight.job)
    highlights: JobHighlight[];

    @ManyToMany(() => Skill, skill => skill.jobs)
    @JoinTable({
        name: "job_skills",
        JoinColumn: { name: "job_id", referenceColumnName: "id"},
        inverseJoinColumn: { name: "skill_id", referenceColumnName: "id" }
    })
    skills: Skills[];
}