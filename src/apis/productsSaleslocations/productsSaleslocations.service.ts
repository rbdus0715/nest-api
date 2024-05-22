import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductSaleslocation } from "./entities/productSaleslocation.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProductsSaleslocationsService {
    constructor(
        @InjectRepository(ProductSaleslocation)
        private readonly productsSaleslocationsRepository: Repository<ProductSaleslocation>,
    ) {}

    create({productSaleslocation}) {
        return this.productsSaleslocationsRepository.save({
            ...productSaleslocation,
        });;
    }
}