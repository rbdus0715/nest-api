import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './apis/products/products.module';
import { ProductsCategoryModule } from './apis/productsCategories/productsCategories.module';

@Module({
  imports: [
    ProductsModule,
    ProductsCategoryModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
    }),
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',       
        port: 3306,
        username: 'root',
        password: 'dmadkr0715',     
        database: 'myproject',
        entities: [__dirname + '/apis/**/*.entity.*'],        
        synchronize: true,     
        logging: true,
    })
  ],
})
export class AppModule {}
