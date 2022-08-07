export type AnyObject = Record<string, any>;

export type Values<T> = T[keyof T];

export type AnyFunction = (...args: any) => any;

export type IStormState<Type> = {
  [Property in keyof Type]: Type[Property];
};
export interface IModelOptions {
  fireDuplicates?: boolean;
  [key: string]: any;
}

export interface IPersistOptions<T> {
  storageKey: string;
  beforeunload: (storm: IStormState<T>) => Partial<IStormState<T>>;
  permanent?: boolean,
}

export interface ISubscriptionOptions<T> {
  needPrevious?: boolean;
}

export interface IVirtualModelOptions<T> extends IModelOptions {
  handler: () => T;
  models: IModel<any>[];
}

export interface IModel<T, G extends IModelOptions = IModelOptions> {
  getState: () => T;
  setOptions: (options: G) => void;
  dispatch: (value: T, options?: IModelOptions) => void | Promise<void>;
  subscribe: (callback: (nextValue: T, options?: IModelOptions) => void, options?: ISubscriptionOptions<T>) => () => void;
}

export type IStormSubcription<T, G = any> = (state: IStormState<T>, subscribe: (state: G) => G) => void;

export type IStormMiddleware<T> = (nextState: IStormState<T>, prevState: IStormState<T>, configs: AnyObject) => void;

export interface IStorm<T> {
  getState: () => IStormState<T>;
  subscribe: (callback: IStormSubcription<T>) => () => void;
  addMiddleware: (middleware: IStormMiddleware) => () => void;
  dispatch: (segments: Partial<T> | ((params: IStormState<T>) => Partial<T>), options?: AnyObject) => void;
}

export function createModel<T>(value: T, options: IModelOptions): IModel<T>;
export function createVirtualModel<T>(options: IVirtualModelOptions<T>): Omit<IModel<T, IVirtualModelOptions>, 'dispatch'>;

export function createStorm<T extends AnyObject>(data: T): IStorm<T>;

export function persisted(stormCreator: typeof createStorm): <T>(options: IPersistOptions<T>) => typeof createStorm;
