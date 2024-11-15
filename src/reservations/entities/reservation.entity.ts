import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';
import { ReservationStatus } from '../enum/reservatio.enum'
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity('reservation')
export class Reservation {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'userId' }) 
  user: User;

  @ManyToOne(() => Room, (room) => room.reservations)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column({ type: 'timestamp' })
  reservationDate: Date;

  @Column({ type: 'timestamp' }) 
  startTime: Date;

  @Column({ type: 'timestamp' }) 
  endTime: Date;

  @Column({ type: 'enum', enum: ReservationStatus }) 
  status: ReservationStatus;

  @OneToMany(() => Notification, (notification) => notification.reservation)
  notifications: Notification[];
}
