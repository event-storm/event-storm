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
  equalityFn?: (prev: T, next: T) => boolean;
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

export type IStormSubcription<T> = (key: keyof T, value: Values<T>, model: IModel<Values<T>>) => void;

export interface IStorm<T> {
  getState: () => IStormState<T>;
  subscribe: (callback: IStormSubcription<T>) => () => void;
  models: { [Property in keyof T]: IModel<T[Property] extends object ? IStorm<T[Property]> : T[Property]> };
  publish: (segments: Partial<T> | ((params: IStormState<T>) => Partial<T> | Promise<Partial<T>>), configuration?: IModelConfiguration) => void | Promise<any>;
}

export function createSubStorm<T, G, K extends any>(
  storm: IStorm<T>,
  callback: (
    state: IStormState<T>,
    subscribe: (value: K) => K,
  ) => G,
): IModel<G, IVirtualModelConfiguration>;
export function createModel<T>(value: T, configuration: IModelConfiguration): IModel<T>;
export function createVirtualModel<T>(options: IVirtualModelParams<T>): IModel<T, IVirtualModelConfiguration>;

export function addMiddlewares(modelsObject: Record<string, IModel<any>>): (...callbacks: Array<(prevValue: any, nextValue: any, options?: Record<string, any>) => void>) => void;

export function createStorm<T extends AnyObject>(data: T, configuration?: IModelConfiguration): IStorm<T>;

export function persisted(stormCreator: typeof createStorm): <T>(configuration: IPersistConfiguration<T>) => typeof createStorm;
