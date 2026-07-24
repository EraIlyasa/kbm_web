import { User } from '../models/User.js';
import { Roles } from '../constants/Roles.js';
import { RandomUtils } from '../utils/RandomUtils.js';

export class UserBuilder {
  private user: User;

  private constructor(user: User) {
    this.user = user;
  }

  /**
   * Initializes a default Admin user builder.
   */
  public static admin(): UserBuilder {
    return new UserBuilder({
      email: process.env.ADMIN_EMAIL || 'admin@company.com',
      password: process.env.ADMIN_PASSWORD || 'adminPassword123',
      role: Roles.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
    });
  }

  /**
   * Initializes a default Customer user builder.
   */
  public static customer(): UserBuilder {
    return new UserBuilder({
      email: process.env.CUSTOMER_EMAIL || 'customer@company.com',
      password: process.env.CUSTOMER_PASSWORD || 'customerPassword123',
      role: Roles.CUSTOMER,
      firstName: 'Customer',
      lastName: 'User',
    });
  }

  /**
   * Dynamically override email.
   * Returns a new builder instance to keep the builder immutable.
   */
  public withEmail(email: string): UserBuilder {
    return new UserBuilder({
      ...this.user,
      email,
    });
  }

  /**
   * Dynamically override password.
   * Returns a new builder instance.
   */
  public withPassword(password: string): UserBuilder {
    return new UserBuilder({
      ...this.user,
      password,
    });
  }

  /**
   * Dynamically override first and last name.
   */
  public withName(firstName: string, lastName: string): UserBuilder {
    return new UserBuilder({
      ...this.user,
      firstName,
      lastName,
    });
  }

  /**
   * Builds and returns the final User object.
   */
  public build(): User {
    return { ...this.user };
  }
}
