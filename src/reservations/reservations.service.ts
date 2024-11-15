import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
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

    // Obtener la hora actual en UTC
    const currentDateTime = new Date();

    // Validar que los valores de fecha y hora sean válidos
    if (!reservationDate || !startTime || !endTime) {
      throw new BadRequestException('Invalid reservation date or time');
    }

    // Validar que la fecha de inicio sea válida
    const reservationStartDateTime = new Date(startTime); // startTime es una fecha completa
    const reservationEndDateTime = new Date(endTime); // endTime es una fecha completa

    if (isNaN(reservationStartDateTime.getTime()) || isNaN(reservationEndDateTime.getTime())) {
      throw new BadRequestException('Invalid start or end time format');
    }

    // Validar disponibilidad de la habitación
    const room = await this.roomService.findOne(roomId);
    if (!room || !room.available) {
      throw new BadRequestException('Room is not available');
    }

    // Validar que la reserva se haga al menos 15 minutos antes de la hora de inicio
    const fifteenMinutesBeforeStartTime = reservationStartDateTime.getTime() - 15 * 60000; // 15 minutos antes de la hora de inicio

    if (currentDateTime.getTime() > fifteenMinutesBeforeStartTime) {
      throw new BadRequestException('Reservation must be made at least 15 minutes in advance');
    }

    // Verificar si la habitación ya está reservada en el mismo rango de tiempo
    const overlappingReservation = await this.reservationRepository.findOne({
      where: {
        room: { id: roomId },
        reservationDate, // La misma fecha
        startTime: LessThanOrEqual(reservationEndDateTime),      // La reserva existente empieza antes de que termine la nueva
        endTime: MoreThanOrEqual(reservationStartDateTime),     // Y termina después de que empiece la nueva
        status: ReservationStatus.PENDING,                      // Asegurarse de que la reserva esté activa
      },
    });

    if (overlappingReservation) {
      throw new BadRequestException('Room is already reserved in this time range');
    }

    // Crear la nueva reserva
    const reservation = this.reservationRepository.create({
      user: { id: userId },
      room: { id: roomId },
      reservationDate,
      startTime: reservationStartDateTime, // Guardar como fecha completa
      endTime: reservationEndDateTime,     // Guardar como fecha completa
      status: ReservationStatus.PENDING,
    });
    await this.reservationRepository.save(reservation);

    // Enviar notificación al usuario
    await this.notificationService.sendNotification(
      userId,
      `Reservation created for room ${roomId}`,
      `Your reservation for ${reservationDate} from ${reservationStartDateTime.toISOString()} to ${reservationEndDateTime.toISOString()} is confirmed.`,
    );

    return reservation;
  }

  async cancelReservation(id: string): Promise<void> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reservation not found');

    // Validar si la fecha y hora de la reserva ya pasó
    const reservationStartDateTime = new Date(reservation.startTime); // Usar la fecha completa
    if (new Date() >= reservationStartDateTime) {
      throw new BadRequestException('Cannot cancel reservation at the reserved time');
    }

    // Cambiar el estado de la reserva a cancelado
    reservation.status = ReservationStatus.CANCELED;
    await this.reservationRepository.save(reservation);

    // Enviar notificación al usuario
    await this.notificationService.sendNotification(
      reservation.user.id,
      'Reservation canceled',
      'Your reservation has been successfully canceled.'
    );
  }
}
