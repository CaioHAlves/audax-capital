import { v4 as uuidv4 } from 'uuid';
import { IdGenerator } from '../domain/id-generator';

export class UuidGenerator implements IdGenerator {
  generate(): string {
    return uuidv4();
  }
}
