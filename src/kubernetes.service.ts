import { Injectable } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import * as spawn from 'cross-spawn';

@Injectable()
export class KubernetesService {
  private kc: k8s.KubeConfig;

  constructor() {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromDefault();
  }

  async createPod(
    name: string,
    options: {
      port: string;
      db: string;
      user: string;
      password: string;
    },
  ): Promise<void> {
    const k8sApi = this.kc.makeApiClient(k8s.CoreV1Api);

    const podManifest = {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: `postgres-pod-${name}`,
        labels: {
          app: `postgres-${name}`,
        },
      },
      spec: {
        containers: [
          {
            name: 'postgres-container',
            image: 'postgres:latest',
            ports: [{ containerPort: Number(options.port) }],
            env: [
              { name: 'POSTGRES_PORT', value: options.port },
              { name: 'POSTGRES_DB', value: options.db },
              { name: 'POSTGRES_USER', value: options.user },
              { name: 'POSTGRES_PASSWORD', value: options.password },
            ],
          },
        ],
      },
    };

    const serviceManifest = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: `postgres-service-${name}`,
      },
      spec: {
        selector: {
          app: `postgres-${name}`, // Match the label used in the pod
        },
        ports: [
          {
            protocol: 'TCP',
            port: Number(options.port), // Port to expose
            targetPort: Number(options.port), // Port on the container
            nodePort: 30001,
          },
        ],
        type: 'NodePort', // Expose externally
      },
    };

    try {
      const response = await k8sApi.createNamespacedPod('default', podManifest);
      console.log('Pod created:', response.body.metadata.name);

      await k8sApi.createNamespacedService('default', serviceManifest);
      console.log('Service created for pod:', response.body.metadata.name);
    } catch (error) {
      console.error('Error creating pod:', error);
    }
  }
}
