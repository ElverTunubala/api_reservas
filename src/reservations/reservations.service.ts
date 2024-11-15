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

    // Convertir las cadenas de texto a objetos Date
    const startTimeDate = new Date(startTime); // Start time como fecha
    const endTimeDate = new Date(endTime); // End time como fecha
    const reservationDateObj = new Date(reservationDate); // Reservation date

    // Validar si las conversiones son válidas
    if (isNaN(startTimeDate.getTime()) || isNaN(endTimeDate.getTime()) || isNaN(reservationDateObj.getTime())) {
      throw new Error('Fechas inválidas: asegúrate de que las fechas estén en formato ISO 8601');
    }

    // Validar que las fechas no sean en el pasado, ajustadas a UTC
    const currentDateTime = new Date(); // La fecha actual en UTC
    const currentDateTimeUtc = new Date(currentDateTime.toISOString()); // Asegurarnos de usar la hora UTC

    // Verificar si la fecha de inicio es en el pasado
    if (startTimeDate < currentDateTimeUtc) {
      throw new BadRequestException('Reservation time cannot be in the past');
    }

    // Validar que la reserva se haga con al menos 15 minutos de anticipación
    const minimumAdvanceTime = new Date(currentDateTimeUtc.getTime() + 15 * 60000);
    if (startTimeDate < minimumAdvanceTime) {
      throw new BadRequestException('Reservation must be made at least 15 minutes in advance');
    }

    // Validar la disponibilidad de la habitación
    const room = await this.roomService.findOne(roomId);
    if (!room || !room.available) {
      throw new BadRequestException('Room is not available');
    }

    // Verificar conflictos de horario
    const overlappingReservations = await this.reservationRepository.find({
      where: {
        room: { id: roomId },
        reservationDate: reservationDateObj,
        status: ReservationStatus.PENDING,
      },
    });

    for (const existing of overlappingReservations) {
      const existingStart = new Date(existing.startTime);
      const existingEnd = new Date(existing.endTime);

      if (
        (startTimeDate >= existingStart && startTimeDate < existingEnd) ||
        (endTimeDate > existingStart && endTimeDate <= existingEnd)
      ) {
        throw new BadRequestException('Room is already reserved in this time range');
      }
    }

    // Crear la nueva reserva
    const reservation = this.reservationRepository.create({
      user: { id: userId },
      room: { id: roomId },
      reservationDate: reservationDateObj,
      startTime: startTimeDate,
      endTime: endTimeDate,
      status: ReservationStatus.PENDING,
    });
    await this.reservationRepository.save(reservation);

    // Enviar notificación al usuario
    await this.notificationService.sendNotification(
      userId,
      `Reservation created for room ${roomId}`,
      `Your reservation for ${reservationDate} from ${startTimeDate} to ${endTimeDate} is confirmed.`,
    );

    return reservation;
  }

  async cancelReservation(id: string): Promise<void> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reservation not found');

    // Validar si la reserva ya empezó
    const reservationStartDateTime = new Date(reservation.startTime);
    if (reservationStartDateTime < new Date()) {
      throw new BadRequestException('Cannot cancel reservation at the reserved time');
    }

    // Cambiar el estado de la reserva a cancelado
    reservation.status = ReservationStatus.CANCELED;
    await this.reservationRepository.save(reservation);

    // Enviar notificación al usuario
    await this.notificationService.sendNotification(
      reservation.user.id,
      'Reservation canceled',
      'Your reservation has been successfully canceled.',
    );
  }
}
