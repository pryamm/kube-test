import { KubernetesService } from './kubernetes.service';
import { WorkspaceController } from './workspace.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [WorkspaceController, AppController],
  providers: [KubernetesService, AppService],
})
export class AppModule {}
