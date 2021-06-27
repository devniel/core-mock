import * as faker from 'faker';

export const userUnverified = {
  active: true,
  email: 'userUnverified@email.com',
  id: '1',
  name: 'test',
  username: 'test',
  verified_email: false,
};

export const userVerified = {
  active: true,
  email: 'userVerified@email.com',
  id: '1',
  name: 'test',
  username: 'test',
  verified_email: true,
};

export class UserFactory {
  static create() {
    return {
      active: true,
      email: faker.internet.email(),
      id: faker.random.uuid(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      username: faker.internet.userName(),
      verified_email: true,
    };
  }
}

export const users = Array.from(Array(10).keys()).map((e) => UserFactory.create());
