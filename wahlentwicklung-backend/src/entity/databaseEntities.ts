import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Wahl {

    @PrimaryGeneratedColumn()
    sqlId: number

    @Column()
    Jahr: string
}

@Entity()
export class Partei {

    @PrimaryGeneratedColumn()
    sqlId: number

    @Column()
    Name: string
}


@Entity()
export class WahlKreis {

    @PrimaryGeneratedColumn()
    sqlId: number

    @Column()
    Wahl: number

    @Column()
    Name: string

    @Column()
    Land: string
}

@Entity()
export class StimmenPartei {

    @PrimaryGeneratedColumn()
    sqlId: number

    @Column()
    WahlId: number

    @Column()
    Erststimmen: number

    @Column()
    Zweitstimmen: number
}

@Entity()
export class StimmenAllgemein {

    @PrimaryGeneratedColumn()
    sqlId: number

    @Column()
    WahlId: number

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