import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationDto } from './dto/create-reservation.dto';
import { RoomService } from '../rooms/rooms.service';
import { NotificationService } from '../notifications/notifications.service';
import { ReservationStatus } from './enum/reservatio.enum';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private roomService: RoomService,
    private notificationService: NotificationService,
  ) {}

  async createReservation(reservationDto: ReservationDto): Promise<Reservation> {
    const { userId, roomId, reservationDate, startTime, endTime } = reservationDto;
    const currentDateTime = new Date();

    // Validar disponibilidad de la habitación
    const room = await this.roomService.findOne(roomId);
    if (!room || !room.available) {
      throw new BadRequestException('Room is not available');
    }

    // Validar que la reserva sea al menos 15 minutos antes de la hora de inicio
    const reservationTime = new Date(`${reservationDate}T${startTime}`);
    if (currentDateTime > new Date(reservationTime.getTime() - 15 * 60000)) {
      throw new BadRequestException('Reservation must be made at least 15 minutes in advance');
    }

    const reservation = this.reservationRepository.create({
      user: { id: userId },
      room: { id: roomId },
      reservationDate,
      startTime,
      endTime,
      status: ReservationStatus.PENDING,
    });
    await this.reservationRepository.save(reservation);

    // Enviar notificación al usuario
    await this.notificationService.sendNotification(
      userId,
      `Reservation created for room ${roomId}`,
      `Your reservation for ${reservationDate} from ${startTime} to ${endTime} is confirmed.`,
    );

    return reservation;
  }

  async cancelReservation(id: string): Promise<void> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reservation not found');

    const reservationTime = new Date(`${reservation.reservationDate}T${reservation.startTime}`);
    if (new Date() >= reservationTime) {
      throw new BadRequestException('Cannot cancel reservation at the reserved time');
    }

    reservation.status = ReservationStatus.CANCELED;
    await this.reservationRepository.save(reservation);

    await this.notificationService.sendNotification(
      reservation.user.id,
      'Reservation canceled',
      'Your reservation has been successfully canceled.'
    );
  }
}
