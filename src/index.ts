import { Container } from 'inversify'
import 'reflect-metadata';
import express from 'express';
import { TYPES } from './types';
import { FooController, BarController, Context, Service } from './controllers';


const container = new Container();
container.bind<Context>(TYPES.Context).to(Context).inRequestScope();
// container.bind<Service>(TYPES.Service).to(Service).inSingletonScope(); <-- This will result in the above request-scope contexts being overridden
container.bind<Service>(TYPES.Service).to(Service); // <-- We need it transient to support the context bind. I guess it could also be request scoped though. 
container.bind<FooController>(TYPES.Controller).to(FooController).whenTargetNamed(FooController.name);
container.bind<BarController>(TYPES.Controller).to(BarController).whenTargetNamed(BarController.name);;

const app = express();

function makeHandler(name: string) :express.Handler {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const handler = container.getNamed<any>(TYPES.Controller, name);
    try {
      await handler.handle(req, res);
    }
    catch(err) {
      next(err);
    }
  }
}

// register containers...
app.use('/foo', makeHandler(FooController.name));
app.use('/bar', makeHandler(BarController.name));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on ${port}`));