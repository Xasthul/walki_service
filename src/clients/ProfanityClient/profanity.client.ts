import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, firstValueFrom } from "rxjs";
import { IProfanityClientResult } from "./types/IProfanityClientResult";

@Injectable()
export class ProfanityClient {
  private readonly defaultConfig: Record<string, any>;
  private readonly url = 'https://vector.profanity.dev';

  constructor(private httpService: HttpService) {
    this.defaultConfig = {
      headers: { 'Content-Type': 'application/json' },
    };
  }


  async verify(message: string) {
    const { data } = await firstValueFrom(
      this.httpService.post<IProfanityClientResult>(
        this.url,
        { message },
        this.defaultConfig,
      ),
    );
    return data;
  }
}