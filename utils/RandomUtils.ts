import { randomUUID } from 'crypto';

export class RandomUtils {
  /**
   * Generates a random email address using current timestamp or UUID.
   */
  public static generateEmail(prefix: string = 'user'): string {
    return `${prefix}-${randomUUID()}@company.com`;
  }

  /**
   * Generates a unique identifier.
   */
  public static generateUUID(): string {
    return randomUUID();
  }

  /**
   * Generates a random string of specified length.
   */
  public static generateString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
