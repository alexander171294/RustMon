import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './environment';
import { ApmErrorInterceptor, ApmHttpUserContextInterceptor, APM_MIDDLEWARE, initializeAPMAgent } from '@student-coin/elastic-apm-nest';

if(environment.APM.enabled){
  initializeAPMAgent({
    serviceName : environment.APM.SERVICE_NAME,
    apiKey: environment.APM.API_KEY,
    serverUrl :  environment.APM.SERVER_URL,
    logLevel : environment.APM.LOGGING,
  })
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  if(environment.APM.enabled) {
    const apmMiddleware = app.get(APM_MIDDLEWARE)
    const globalInterceptors = [
      app.get(ApmHttpUserContextInterceptor),
      app.get(ApmErrorInterceptor),
    ];
    app.useGlobalInterceptors(...globalInterceptors);
    app.use(apmMiddleware)
  }
  await app.listen(3000);
}
bootstrap();
