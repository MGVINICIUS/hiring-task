import { AppDataSouce } from '../db';

beforeAll(async () => {
  await AppDataSouce.initialize();
});

afterAll(async () => {
  await AppDataSouce.destroy();
});

beforeEach(async () => {
  // Clear data and reset auto-increment
  const queryRunner = AppDataSouce.createQueryRunner();
  await queryRunner.connect();
  
  try {
    await queryRunner.startTransaction();
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
    
    const entities = AppDataSouce.entityMetadatas;
    for (const entity of entities) {
      const tableName = entity.tableName;
      await queryRunner.query(`TRUNCATE TABLE ${tableName}`);
    }
    
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
});