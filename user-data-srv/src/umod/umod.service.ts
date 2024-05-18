import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UmodService {

  private readonly logger = new Logger(UmodService.name);

  constructor(private http: HttpService) {}

  public getPluginVersion(id: string) {
    // ExampleId to example-id
    // console.log(`Plugin slug: ${id}`);
    return this.http.get(`https://umod.org/plugins/${id}.json`);
  }

}