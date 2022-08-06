export type AnyObject = Record<string, any>;

export type Values<T> = T[keyof T];

export type AnyFunction = (...args: any) => any;

export type IStormState<Type> = {
  [Property in keyof Type]: Type[Property];
};
export interface IModelConfiguration {
  fireDuplicates?: boolean;
  [key: string]: any;
}

export interface IVirtualModelConfiguration extends IModelConfiguration {
  models?: IModel<any>[];
}

export interface IPersistConfiguration<T> {
  storageKey: string;
  beforeunload: (storm: IStormState<T>) => Partial<IStormState<T>>;
  permanent?: boolean,
}

export interface ISubscriptionOptions<T> {
  needPrevious?: boolean;
}

export interface IVirtualModelParams<T> extends IModelConfiguration {
  handler: () => T;
  models: IModel<any>[];
}

export interface IModel<T, G extends IModelConfiguration = IModelConfiguration> {
  getState: () => T;
  setOptions: (configuration: G) => void;
  publish: (value: T, configuration?: IModelConfiguration) => void | Promise<void>;
  subscribe: (callback: (nextValue: T) => void, configuration?: ISubscriptionOptions<T>) => () => void;
}

export type IStormSubcription<T, G = any> = (state: IStormState<T>, subscribe: (state: G) => G) => void;

export type IStormMiddleware<T> = (nextState: IStormState<T>, prevState: IStormState<T>, configs: AnyObject) => void;

export interface IStorm<T> {
  getState: () => IStormState<T>;
  subscribe: (callback: IStormSubcription<T>) => () => void;
  addMiddleware: (middleware: IStormMiddleware) => () => void;
  publish: (segments: Partial<T> | ((params: IStormState<T>) => Partial<T>), configuration?: AnyObject) => void;
}

export function createModel<T>(value: T, configuration: IModelConfiguration): IModel<T>;
export function createVirtualModel<T>(options: IVirtualModelParams<T>): IModel<T, IVirtualModelConfiguration>;

export function createStorm<T extends AnyObject>(data: T): IStorm<T>;

export function persisted(stormCreator: typeof createStorm): <T>(configuration: IPersistConfiguration<T>) => typeof createStorm;
