import { Entity, PrimaryGeneratedColumn, Column, Timestamp, CreateDateColumn, UpdateDateColumn, EntitySchema, DeleteDateColumn } from "typeorm"

export class BaseColumnSchema {

    @PrimaryGeneratedColumn()
    sqlId: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

@Entity()
export class Wahl {

    @PrimaryGeneratedColumn()
    sqlId: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @Column()
    year: number
}

@Entity()
export class Partei {

    @PrimaryGeneratedColumn()
    sqlId: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date



    @Column()
    name: string
}


@Entity()
export class WahlKreis {

    @PrimaryGeneratedColumn()
    sqlId: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date



    @Column()
    wahlId: number

    @Column()
    name: string

    @Column()
    bundesland: string
}

@Entity()
export class StimmenPartei {

    @PrimaryGeneratedColumn()
    sqlId: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date



    @Column()
    wahlId: number

    @Column()
    erststimmen: number

    @Column()
    zweitstimmen: number
}

@Entity()
export class StimmenAllgemein {

    @PrimaryGeneratedColumn()
    sqlId: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date



    @Column()
    wahlId: number

    @Column()
    anzahlWaehler: number

    @Column()
    anzahlGueltigeErststimmen: number
    
    @Column()
    anzahlGueltigeZweitstimmen: number
    
    @Column()
    anzahlUngueltigeErststimmen: number
    
    @Column()
    anzahlUngueltigeZweitstimmen: number
}