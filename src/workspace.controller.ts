import { Controller, Post } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';

@Controller('workspace')
export class WorkspaceController {
  @Post()
  async createWorkspace() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    const namespace = {
      metadata: {
        name: 'test',
      },
    };

    await k8sApi.createNamespace(namespace);

    return { message: 'Workspace created.' };
  }
}
