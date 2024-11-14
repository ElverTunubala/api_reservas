import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('notification')
export class Notification {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @ManyToOne(() => Reservation, (reservation) => reservation.notifications)
  reservation: Reservation;
  

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'timestamp' })
  sentDate: Date;

  @Column({ type: 'text' })
  message: string;
}
