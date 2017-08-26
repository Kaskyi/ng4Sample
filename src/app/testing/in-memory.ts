import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const data = [
      { id: 0, name: '0' },
      { id: 1, name: '1' },
    ];
    return { data };
  }
}
