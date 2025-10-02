import { envs } from "../../config";
import { CategoryModel } from "../mongo/models/category.model";
import { ProductModel } from "../mongo/models/product.model";
import { UserModel } from "../mongo/models/user.model";
import { MongoDatabase } from "../mongo/mongo-database";
import { seedData } from "./data";

(async () => {
  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });

  await main();

  await MongoDatabase.disconnect();
})();

const randomBetweeen = (x: number) => {
  return Math.floor(Math.random() * x);
};

async function main() {
  // 0. Borrar todo
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);

  // 1. Crear usuarios
  const usersData = await seedData.users;
  const users = await UserModel.insertMany(usersData);

  // 2. Crear categorías
  const categories = await CategoryModel.insertMany(
    seedData.categories.map((category) => ({
      ...category,
      user: users[randomBetweeen(users.length)]._id,
    }))
  );

  // 3. Crear productos
  const products = await ProductModel.insertMany(
    seedData.products.map((product) => ({
      ...product,
      user: users[randomBetweeen(users.length - 1)]._id,
      category: categories[randomBetweeen(categories.length - 1)]._id,
    }))
  );


  console.log('seeded');
}
