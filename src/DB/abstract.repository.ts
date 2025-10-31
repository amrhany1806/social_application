import { Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

export class AbstractRepository<T> {
    constructor(protected model: Model<T>) { }

    async create(item:Partial<T>) {
        const doc = new this.model(item);
        doc['isNew']
        return await doc.save();
    }
    async exist(filter:RootFilterQuery<T>,projection?:ProjectionType<T>,options?:QueryOptions<T>){
        return await this.model.findOne(filter,projection,options)
    }

    async getOne(filter: RootFilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>) {
        return await this.model.findOne(filter, projection, options)
    }

    async update(filter: RootFilterQuery<T>, update?: UpdateQuery<T>, options?: MongooseUpdateQueryOptions<T>) {
        return await this.model.updateOne(filter, update, options)
    }

    async delete(filter: RootFilterQuery<T>) {
        return await this.model.deleteOne(filter)
    }
    async getAllUsers() {
        return await this.model.find();
    }
}

