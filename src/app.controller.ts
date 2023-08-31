import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { KubernetesService } from './kubernetes.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly kubernetesService: KubernetesService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create-pod')
  async createPod(
    @Body()
    body: {
      name: string;
      options: {
        port: string;
        db: string;
        user: string;
        password: string;
      };
    },
  ): Promise<string> {
    await this.kubernetesService.createPod(body.name, body.options);
    return 'Pod creation triggered.';
  }
}
