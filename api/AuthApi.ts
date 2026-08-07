import { APIRequestContext, APIResponse } from '@playwright/test';
import { URLs } from '../constants/URLs.js';

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * Performs an authentication login request via API.
   */
  public async login(email: string, password: string): Promise<APIResponse> {
    return await this.request.post(URLs.API.AUTH_LOGIN, {
      data: {
        email,
        password,
      },
    });
  }
}
