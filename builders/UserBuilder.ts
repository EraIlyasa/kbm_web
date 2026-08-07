import { User } from '../models/User.js';
import { Roles } from '../constants/Roles.js';
import { requireEnv } from '../utils/EnvUtils.js';

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
      email: requireEnv('ADMIN_EMAIL'),
      password: requireEnv('ADMIN_PASSWORD'),
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
      email: requireEnv('CUSTOMER_EMAIL'),
      password: requireEnv('CUSTOMER_PASSWORD'),
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
