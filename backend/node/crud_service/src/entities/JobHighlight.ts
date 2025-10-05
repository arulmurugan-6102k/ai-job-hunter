import { Entity, PrimaryGenratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, JoinColumn } from "typeorm";
import { Job } from "./Job";

@Entity("job_hightlights")
@Index(["job_id"])
export class JobHighlight {
    @PrimaryGenratedColumn()
    id: number;

    @Column()
    job_id: number;

    @Column({ type: "text"})
    highlight: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    update_at: Date;

    @ManyToOne(() => Job, job => job.highlight, { onDelete: "CASCADE"})
    @JoinColumn({ name: "job_id"})
    job: Job;
}