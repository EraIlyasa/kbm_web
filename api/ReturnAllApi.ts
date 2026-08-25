import { APIRequestContext, APIResponse } from '@playwright/test';
import { URLs } from '../constants/URLs.js';
import { Credentials } from '../constants/Credentials.js';

export class ReturnAllApi {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * Resets/removes an email that is already registered on the dev server so the
   * registration flow can be tested again from scratch.
   *
   * NOTE: the JWT used here comes from `API_AUTH_TOKEN` in the `.env` file and
   * must be rotated (regenerated) once it expires.
   */
  public async resetRegisteredEmail(): Promise<APIResponse> {
    return await this.request.post(`${Credentials.DEV_API_URL}${URLs.API.RETURN_ALL}`, {
      headers: {
        secretbgt: Credentials.BGT_SECRET,
        Authorization: `Bearer ${Credentials.API_AUTH_TOKEN}`,
      },
      data: {
        secret: 'removeRegisteredEmail',
      },
    });
  }
}
