// TODO:: types are mismatching

export interface AnyObject {
  [key: string]: any;
}

export type AnyFunction = (...args: any) => any;

export type IStoreState<Type> = {
  [Property in keyof Type]: Type[Property] extends AnyFunction
    ? ReturnType<Type[Property]>
    : Type[Property];
};

export type Values<T> = T[keyof T];

export interface IModelConfiguration {
  fireDuplicates?: boolean;
  [key: string]: any;
}

export interface IVirtualModelConfiguration extends IModelConfiguration {
  models?: IModel<any>[];
}

export interface IPersistConfiguration<T> {
  storageKey: string;
  beforeunload: (store: IStoreState<T>) => Partial<IStoreState<T>>;
  permanent?: boolean,
}

export interface IModel<T, G extends IModelConfiguration = IModelConfiguration> {
  getState: () => T;
  setOptions: (configuration: G) => void;
  publish: (value: T, configuration?: G) => void | Promise<T>;
  subscribe: (callback: (nextValue: T) => void, needPrevious?: boolean) => () => void;
}

export type IStoreSubcription<T> = (key: keyof T, value: Values<T>, model: IModel<Values<T>>) => void;

export interface IStore<T> {
  getState: () => IStoreState<T>;
  subscribe: (callback: IStoreSubcription<T>) => () => void;
  models: { [Property in keyof T]: IModel<T[Property] extends AnyFunction ? ReturnType<T[Property]> : T[Property]> };
  publish: (segments: Partial<T> | ((params: IStoreState<T>) => Partial<T> | Promise<Partial<T>>), configuration?: IModelConfiguration) => void | Promise<any>;
}

interface IConfigureOptions {
  needLogs?: boolean;
}

export function createModel<T>(value: T, configuration: IModelConfiguration): IModel<T>;
export function createVirtualModel<T>(
  callback: () => T,
  configuration?: IVirtualModelConfiguration,
): IModel<T, IVirtualModelConfiguration>;

export function addMiddlewares(modelsObject: Record<string, IModel<any>>): (...callbacks: Array<(prevValue: any, nextValue: any, options?: Record<string, any>) => void>) => void;

export function createStore<T extends AnyObject>(options: T): IStore<T>;

export function configure(options: IConfigureOptions): void;

export function persisted(storeCreator: typeof createStore): (configuration: IPersistConfiguration) => typeof createStore;
