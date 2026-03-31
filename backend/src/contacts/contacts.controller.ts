import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; email: string }) {
    return this.contactsService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(Number(id));
  }
}