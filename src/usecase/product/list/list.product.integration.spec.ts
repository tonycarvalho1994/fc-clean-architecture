import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";
import Product from "../../../domain/product/entity/product";

describe("Test list products use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const product1 = ProductFactory.create("a", "Product A", 100);
    const product2 = ProductFactory.create("a", "Product B", 200);
    await productRepository.create(product1 as Product);
    await productRepository.create(product2 as Product);

    const output = await usecase.execute({});

    expect(output).toEqual({
      products: [
        {
          id: product1.id,
          name: product1.name,
          price: product1.price,
        },
        {
          id: product2.id,
          name: product2.name,
          price: product2.price,
        },
      ],
    });
  });
});
