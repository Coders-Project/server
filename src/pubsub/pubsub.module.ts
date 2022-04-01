import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

const PUB_SUB = 'pub_sub';

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useClass: PubSub,
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
