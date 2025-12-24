import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser } from '../../common/decorators';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    // Create a booking
    @Post()
    async create(
        @CurrentUser('sub') renterId: string,
        @Body() dto: CreateBookingDto,
    ) {
        return this.bookingsService.create(renterId, dto);
    }

    // Get my bookings (as renter)
    @Get('my-bookings')
    async getMyBookings(@CurrentUser('sub') renterId: string) {
        return this.bookingsService.findByRenter(renterId);
    }

    // Get bookings for my listings (as host)
    @Get('host-bookings')
    async getHostBookings(@CurrentUser('sub') hostId: string) {
        return this.bookingsService.findByHost(hostId);
    }

    // Get single booking
    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @CurrentUser('sub') userId: string,
    ) {
        const booking = await this.bookingsService.findById(id);

        // Only renter or host can view
        if (booking.renterId !== userId && booking.hostId !== userId) {
            throw new Error('You do not have access to this booking');
        }

        return booking;
    }

    // Update booking status (confirm/reject/cancel)
    @Put(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @CurrentUser('sub') userId: string,
        @Body() dto: UpdateBookingStatusDto,
    ) {
        return this.bookingsService.updateStatus(id, userId, dto);
    }

    // Get booked dates for a listing (public-ish, used for calendar)
    @Get('listing/:listingId/dates')
    async getBookedDates(@Param('listingId') listingId: string) {
        return this.bookingsService.getBookedDates(listingId);
    }
}
