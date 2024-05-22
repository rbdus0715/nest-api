import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { ProductsCategoriesService } from "./productsCategories.service";
import { ProductCategory } from "./entities/productCategory.entity";

@Resolver()
export class ProductsCategoriesResolver {
    constructor(
        private readonly productsCategoriesService: ProductsCategoriesService,
    ) {}

    @Mutation(() => ProductCategory)
    createProductCategory(
        @Args('name') name: string,
    ): Promise<ProductCategory> {
        return this.productsCategoriesService.create({name});
    }
}