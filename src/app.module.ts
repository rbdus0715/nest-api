import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './apis/products/products.module';
import { ProductsCategoryModule } from './apis/productsCategories/productsCategories.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    ProductsModule,
    ProductsCategoryModule,

    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
    }),
    TypeOrmModule.forRoot({
        type: process.env.DATABASE_TYPE as 'mysql',
        host: process.env.DATABASE_HOST,       
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_HOST,
        password: process.env.DATABASE_PASSWORD,     
        database: process.env.DATABASE_DATABASE,
        entities: [__dirname + '/apis/**/*.entity.*'],        
        synchronize: true,     
        logging: true,
    })
  ],
})
export class AppModule {}
