import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Job } from "./Job";

@Entity("companies")
export class Company {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique:true})
    @Index()
    name: string;

    @Column({ type: "decimal", precision: 2, scale: 1, nullable: true})
    rating: number;

    @Column({ nullable: true })
    review_count: number;

    @Column({ type: text, nullable: true })
    about: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Job, job => job.company)
    jobs: jobs[];
}
