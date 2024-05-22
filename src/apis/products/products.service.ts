import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IProductsServiceCheckDelete, IProductsServiceCheckSoldout, IProductsServiceCreate, IProductsServiceFindOne, IProductsServiceUpdate } from "./interfaces/products-service.interface";
import { ProductsSaleslocationsService } from "../productsSaleslocations/productsSaleslocations.service";
import { ProductsTagsService } from "../productsTags/productsTags.service";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        private readonly productsSaleslocationsService: ProductsSaleslocationsService,
        private readonly productsTagsService: ProductsTagsService,
    ) {}

    findAll(): Promise<Product[]> {
        return this.productsRepository.find({
            relations: ['productSaleslocation', 'productCategory'],
        });
    }

    findOne({productId}: IProductsServiceFindOne): Promise<Product> {
        return this.productsRepository.findOne({
            where: { id: productId}, relations: ['productSaleslocation', 'productCategory'],
        });
    }

    async create({createProductInput}: IProductsServiceCreate): Promise<Product> {
        // 1. 상품 하나만 등록
        // const result = this.productsRepository.save({
        //     ...createProductInput,
        // })
        // return result;

        // 2. 상품과 나머지 정보 같이 등록
        const {productSaleslocation, productCategoryId, productTags, ...product} = createProductInput;
        // 2-1) 상품거래위치
        const result = await this.productsSaleslocationsService.create({productSaleslocation});
        // 2-2) 상품태그등록
        const tagNames = productTags.map(el=>el.replace('#', ''));                  // 저장할 태그들
        const prevTags = await this.productsTagsService.findByNames({tagNames});    // 저장할 태그 중 이미 있는 태그들
        const temp = [];                                                            // 이미 있는 태그를 제외한 나머지
        tagNames.forEach(el => {
            const isExists = prevTags.find(prevEl => el === prevEl.name);
            if(!isExists) temp.push({name: el});
        })
        const newTags = await this.productsTagsService.bulkInsert({names: temp});   // 중복 없는 것만 일단 저장
        const tags = [...prevTags, ...newTags.identifiers];                         // 다시 원본 복구

        const result2 = this.productsRepository.save({
            ...product,
            productSaleslocation: result,                                           // 일대일 관계
            productCategory: {id: productCategoryId},                               // 일대다 관계
            productTags: tags,                                                      // 다대다 관계
        })
        return result2;
    }

    async update({productId, updateProductInput}: IProductsServiceUpdate): Promise<Product> {
        const product = await this.findOne({productId});
        const {productTags, ...rest} = updateProductInput;
        
        // 추가한 내용
        const tagNames = productTags.map(el=>el.replace('#', ''));
        const prevTags = await this.productsTagsService.findByNames({tagNames});
        const temp = [];
        tagNames.forEach(el => {
            const isExists = prevTags.find(prevEl => el === prevEl.name);
            if(!isExists) temp.push({name: el});
        })
        const newTags = await this.productsTagsService.bulkInsert({names: temp});
        const tags = [...prevTags, ...newTags.identifiers];

        this.checkSoldout({product});
        const result = this.productsRepository.save({
            ...product,
            ...rest,
            productTags: tags // productTags는 string[] 이라서 ProductTag[] 타입으로 만들어야함
        })
        return result;
    }

    checkSoldout({product}: IProductsServiceCheckSoldout): void {
        if(product.isSoldout) {
            throw new UnprocessableEntityException('이미 판매 완료된 상품입니다.');
        }
    }

    async delete({productId}: IProductsServiceCheckDelete): Promise<boolean> {
        const result = await this.productsRepository.softDelete({id: productId});
        return result.affected ? true:false;
    }
}