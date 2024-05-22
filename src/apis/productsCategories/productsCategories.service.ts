import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductCategory } from "./entities/productCategory.entity";
import { IProductsCategoriesServiceCreate } from "./interfaces/products-categories-service.interface";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProductsCategoriesService {
    constructor(
        @InjectRepository(ProductCategory)
        private readonly productsCategoriesRepository: Repository<ProductCategory>,
    ) {}

    create({name}: IProductsCategoriesServiceCreate): Promise<ProductCategory> {
        return this.productsCategoriesRepository.save({name});
    }
}