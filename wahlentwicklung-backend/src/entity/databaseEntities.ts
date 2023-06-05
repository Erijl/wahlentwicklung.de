import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
  
@Entity()
export class Wahl {
  @PrimaryGeneratedColumn()
  sqlId: number;

  @Column()
  year: number;
}

@Entity()
export class Party {
  @PrimaryGeneratedColumn()
  sqlId: number;

  @Column()
  name: string;

  @ManyToOne(() => Wahl)
  bundestagswahl: Wahl;
}

@Entity()
export class Bundesland {
  @PrimaryGeneratedColumn()
  sqlId: number;

  @Column()
  name: string;

  @Column()
  identifier: number;

  @ManyToOne(() => Wahl)
  bundestagswahl: Wahl;
}

@Entity()
export class Wahlkreis {
  @PrimaryGeneratedColumn()
  sqlId: number;

  @Column()
  name: string;

  @Column()
  wahlberechtigte_endgueltig: number;

  @Column()
  wahlberechtigte_vorperiode: number;

  @Column()
  waehler_endgueltig: number;

  @Column()
  waehler_vorperiode: number;

  @Column()
  gueltige_erststimmen_endgueltig: number;

  @Column()
  gueltige_erststimmen_vorperiode: number;

  @Column()
  gueltige_zweitstimmen_endgueltig: number;

  @Column()
  gueltige_zweitstimmen_vorperiode: number;

  @Column()
  ungueltige_erststimmen_endgueltig: number;

  @Column()
  ungueltige_erststimmen_vorperiode: number;

  @Column()
  ungueltige_zweitstimmen_endgueltig: number;

  @Column()
  ungueltige_zweitstimmen_vorperiode: number;

  @ManyToOne(() => Wahl)
  bundestagswahl: Wahl;

  @ManyToOne(() => Bundesland)
  bundesland: Bundesland;

  @OneToMany(() => VoteCounts, (voteCounts) => voteCounts.wahlkreis)
  voteCounts: VoteCounts[];
}

@Entity()
export class VoteCounts {
  @PrimaryGeneratedColumn()
  sqlId: number;

  @ManyToOne(() => Wahl)
  bundestagswahl: Wahl;

  @ManyToOne(() => Party)
  party: Party;

  @ManyToOne(() => Wahlkreis)
  wahlkreis: Wahlkreis;

  @Column()
  erststimmen_endgueltig: number;

  @Column()
  erststimmen_vorperiode: number;

  @Column()
  zweitstimmen_endgueltig: number;

  @Column()
  zweitstimmen_vorperiode: number;
}