import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contact.findMany();
  }

  async create(data: { name: string; email: string }) {
    return this.prisma.contact.create({ data });
  }

  async update(id: number, data: { name?: string; email?: string }) {
    return this.prisma.contact.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.contact.delete({ where: { id } });
  }
}