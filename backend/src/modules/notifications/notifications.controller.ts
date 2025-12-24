import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser } from '../../common/decorators';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    // Get all notifications
    @Get()
    async getAll(@CurrentUser('sub') userId: string) {
        return this.notificationsService.getAll(userId);
    }

    // Get unread count
    @Get('unread-count')
    async getUnreadCount(@CurrentUser('sub') userId: string) {
        const count = await this.notificationsService.getUnreadCount(userId);
        return { count };
    }

    // Mark single as read
    @Post(':id/read')
    async markAsRead(
        @Param('id') id: string,
        @CurrentUser('sub') userId: string,
    ) {
        await this.notificationsService.markAsRead(id, userId);
        return { success: true };
    }

    // Mark all as read
    @Post('read-all')
    async markAllAsRead(@CurrentUser('sub') userId: string) {
        await this.notificationsService.markAllAsRead(userId);
        return { success: true };
    }

    // Delete notification
    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @CurrentUser('sub') userId: string,
    ) {
        await this.notificationsService.delete(id, userId);
        return { success: true };
    }
}
