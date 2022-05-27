/* eslint-disable prettier/prettier */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter } from 'events';
import { Document, Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';

export class BaseRepository<T extends Document> extends EventEmitter {
  protected primaryKey = '_id';

  constructor(
    protected readonly model: Model<T>,
    protected readonly logger: PinoLogger,
  ) {
    super();
    this.model = model;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async create(entity: object): Promise<T> {
    try {
      return new this.model(entity).save();
    } catch (error) {
      this.logger.error({ err: error }, 'create(): Exception caught on create');
      throw new BadRequestException(error.message);
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async createOrUpdate(entity: object): Promise<T> {
    try {
      let model = await this.findOne({
        [this.primaryKey]: entity[this.primaryKey],
      });

      if (model === null) {
        model = await new this.model(entity).save();
      } else {
        await model.set(entity).save();
      }

      return model;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<T> {
    const model = await Promise.resolve(this.model.findById(id));
    if (!model) {
      throw new NotFoundException(`Not found id: ${id}`);
    }
    return model;
  }

  async findByIdWithLean(id: string) {
    const model = await Promise.resolve(this.model.findById(id).lean());
    if (!model) {
      throw new NotFoundException(`Not found id: ${id}`);
    }
    return model;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async findOne(params: object): Promise<T> {
    const model = await Promise.resolve(this.model.findOne(params));
    return model;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async find(params: object = {}): Promise<T[]> {
    const models = await Promise.resolve(this.model.find(params));
    return models;
  }

  async findAll(
    filter: { [key: string]: any } = {},
    limit = 0,
    sort: { [key: string]: any } = {},
  ): Promise<Array<T>> {
    const query = this.model
      .find(filter as any)
      .limit(limit)
      .sort(sort);
    const response = await query.exec();
    return response;
  }

  async findAllLean(
    filter: { [key: string]: any } = {},
    limit = 0,
    sort: { [key: string]: any } = {},
  ): Promise<any> {
    const query = this.model
      .find(filter as any)
      .limit(limit)
      .sort(sort)
      .lean();
    return query.exec();
  }

  getModel(): Model<T> {
    return this.model;
  }

  async removeAll(filter: { [key: string]: any } = {}) {
    return this.model.deleteMany(filter as any);
  }
}
