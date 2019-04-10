import { injectable, inject } from 'inversify';
import express from 'express';
import { TYPES } from './types';

@injectable()
export class Context {
  [x: string]: number;
  constructor() {
    console.log('new context!!!');
  }
}

@injectable()
export class Service {
  private context: Context;
  constructor(
    @inject(TYPES.Context) context: Context,
  ) {
    this.context = context;
    console.log('new Service!!!');
  }

  doAction(name: string) {
    return `Controller ${name} says ${this.context.value}`;
  }
}

@injectable()
export class FooController {
  private context: Context;
  private service: Service;

  constructor(
    @inject(TYPES.Context) context: Context,
    @inject(TYPES.Service) service: Service,
  ) {
    this.context = context;
    this.service = service;
  }

  handle(req: express.Request, res: express.Response) {
    console.log(this.context);
    this.context.value = 1;
    setTimeout(() => {
      console.log(this.context);
      res.send(this.service.doAction(this.constructor.name));
    }, 1000);
  }
}

@injectable()
export class BarController {
  private context: Context;
  private service: Service;
  constructor(
    @inject(TYPES.Context) context: Context,
    @inject(TYPES.Service) service: Service,
  ) {
    this.context = context;
    this.service = service;
  }

  handle(req: express.Request, res: express.Response) {
    console.log(this.context);
    this.context.value = 2;
    setTimeout(() => {
      console.log(this.context);
      res.send(this.service.doAction(this.constructor.name));
    }, 1000);
  }
}