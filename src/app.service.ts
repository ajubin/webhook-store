import { Injectable } from '@nestjs/common';
import { Prisma, Webhook } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { pubSub } from './pubsub';
import { mapWebhookSchemaToModel } from './webhook.mapper';
import { WebhookModel } from './webhook.model';
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<string> {
    const webhooks = await this.prisma.webhook.findMany({});
    return `${webhooks.length} Hello World!`;
  }

  async addWebhook(data: Prisma.WebhookCreateInput): Promise<Webhook> {
    const webhook = await this.prisma.webhook.create({ data });
    pubSub.publish('webhookAdded', {
      webhookAdded: mapWebhookSchemaToModel(webhook),
    });
    return webhook;
  }

  async getWebhooks(): Promise<WebhookModel[]> {
    const webhooks = await this.prisma.webhook.findMany({});
    return webhooks.map(mapWebhookSchemaToModel);
  }

  async deleteWebhooks() {
    return this.prisma.webhook.deleteMany({});
  }
}
