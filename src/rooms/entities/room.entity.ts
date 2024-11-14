import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('room')
export class Room {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  number: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];
}
