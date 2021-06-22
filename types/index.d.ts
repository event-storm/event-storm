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

export interface IModel<T> {
  getState: () => T;
  event: string | string[];
  publish: (value: T, options?: AnyObject) => void | Promise<T>;
  subscribe: (callback: (nextValue: T) => void, needPrevious?: boolean) => () => void;
}

export interface IModelsHistory {
  goBack: () => void;
  goForward: () => void;
  hasNext: () => boolean;
  hasPrevious: () => boolean;
}

export function createModel<T>(value: T): IModel<T>;
export function createVirtualModel<T>(
  callback: () => T,
  options?: { models?: IModel<any>[] }
): IModel<T>;

export function addMiddlewares(
  ...middlewares: Array<
    (
      previousValue: any,
      nextValue: any,
      options: { model: IModel<any> }
    ) => void
  >
): void;

export function createHistory(
  models: IModel<any>[],
  options?: { captureExisting: boolean }
): IModelsHistory;

export type IStoreSubcription<T> = (key: keyof T, value: Values<T>, model: IModel<Values<T>>) => void;

export interface IStore<T> {
  getState: () => IStoreState<T>;
  subscribe: (callback: IStoreSubcription<T>) => () => void;
  models: { [Property in keyof T]: IModel<T[Property] extends AnyFunction ? ReturnType<T[Property]> : T[Property]> };
  publish: (segments: Partial<T> | ((params: IStoreState<T>) => Partial<T> | Promise<Partial<T>>), options?: AnyObject) => void | Promise<any>;
}

export function createStore<T extends AnyObject>(options: T): IStore<T>;
