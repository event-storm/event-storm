import { createModel, createVirtualModel } from 'src';

import { defaultdispatchConfigs } from './constants';

describe('Creating a Virtual Model', () => {
  test('model object pass match pattern', () => {
    const first = createModel('first');
    const second = createModel('second');
    const processor = jest.fn(() => {});

    const virtualModel = createVirtualModel({ models: [first, second], handler: processor });

    expect(processor).toBeCalledTimes(0);
    expect(typeof virtualModel).toBe('object');
    expect(typeof virtualModel.getState).toBe('function');
    expect(typeof virtualModel.subscribe).toBe('function');
  });
  test('Unsubscribing must make the callback not fire anymore', () => {
    const value1 = 'Peter';
    const model1 = createModel(value1);
    const value2 = 20;
    const model2 = createModel(value2);
    const value3 = { city: 'New York' };
    const model3 = createModel(value3);
    const virtual = createVirtualModel({
      models: [model1, model2, model3],
      handler: () => `${model1.getState()} is alone in ${model3.getState().city} at his ${model2.getState()}`,
    });
    const callback = jest.fn();
    const nextValue2 = 80;

    const unsubscribe = virtual.subscribe(callback);
    unsubscribe();
    model2.dispatch(nextValue2);

    expect(callback).toBeCalledTimes(0);
  });


  test('Get state must give the default state, when nothing dispatched', () => {
    const name = createModel('Foo');
    const surname = createModel('Bar');
    const fullname = createVirtualModel(
      {
        models: [name, surname],
        handler: () => `${name.getState()} ${surname.getState()}`,
      },
    );

    expect(fullname.getState()).toBe('Foo Bar');
  });

  test('State must be updated after dispatchment(primitive value)', () => {
    const grossSalary = createModel(100_000);
    const taxes = createModel(20);
    const netSalary = createVirtualModel({
      models: [grossSalary, taxes],
      handler: () => grossSalary.getState() * (100 - taxes.getState()) / 100,
    });

    expect(netSalary.getState()).toBe(80_000);

    grossSalary.dispatch(200_000);

    expect(netSalary.getState()).toBe(160_000);
  });

  test('State must be updated after dispatchment(by function)', () => {
    const grossSalary = createModel(100_000);
    const taxes = createModel(20);
    const netSalary = createVirtualModel({
      models: [grossSalary, taxes],
      handler: () => grossSalary.getState() * (100 - taxes.getState()) / 100,
    });

    expect(netSalary.getState()).toBe(80_000);

    taxes.dispatch(() => 40);

    expect(netSalary.getState()).toBe(60_000);
  });

  test('Subscribe method must be fired when value dispatched', () => {
    const value1 = 'Peter';
    const model1 = createModel(value1);
    const value2 = 20;
    const model2 = createModel(value2);
    const value3 = { city: 'New York' };
    const model3 = createModel(value3);
    const virtual = createVirtualModel({
      models: [model1, model2, model3],
      handler: () => `${model1.getState()} is alone in ${model3.getState().city} at his ${model2.getState()}`,
    });
    const callback = jest.fn();
    const nextValue2 = 80;
    const nextValue3 = { city: 'Tokio' };

    virtual.subscribe(callback);
    model2.dispatch(nextValue2);

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(`${value1} is alone in ${value3.city} at his ${nextValue2}`, defaultdispatchConfigs);

    model3.dispatch(nextValue3);

    expect(callback).toBeCalledTimes(2);
    expect(callback).lastCalledWith(`${value1} is alone in ${nextValue3.city} at his ${nextValue2}`, defaultdispatchConfigs);
  });

  test('Subscribe method must be fired when needPrevious is set to true', () => {
    const value1 = 'Peter';
    const model1 = createModel(value1);
    const value2 = 20;
    const model2 = createModel(value2);
    const value3 = { city: 'New York' };
    const model3 = createModel(value3);
    const virtual = createVirtualModel({
      models: [model1, model2, model3],
      handler: () => `${model1.getState()} is alone in ${model3.getState().city} at his ${model2.getState()}`,
    });
    const callback = jest.fn();

    virtual.subscribe(callback, { needPrevious: true });

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(`${value1} is alone in ${value3.city} at his ${value2}`);
  });

  test('Subscribe method must be fired anytime when fireDuplicates is set to true', () => {
    const value1 = 'Peter';
    const model1 = createModel(value1);
    const value2 = 20;
    const model2 = createModel(value2);
    const value3 = { city: 'New York' };
    const model3 = createModel(value3);
    const virtual = createVirtualModel({
      models: [model1, model2, model3],
      handler: () => `${model1.getState()} is alone in ${model3.getState().city} at his ${model2.getState()}`,
    });
    const callback = jest.fn();

    virtual.setOptions({ fireDuplicates: true });
    virtual.subscribe(callback);

    model1.dispatch(value1);

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(`${value1} is alone in ${value3.city} at his ${value2}`, defaultdispatchConfigs);
  });

  test('It must be possible to create virtualModel over virtual model', () => {
    const grossSalary = createModel(100_000);
    const taxes = createModel(20);
    const netSalary = createVirtualModel({
      models: [grossSalary, taxes],
      handler: () => grossSalary.getState() * (100 - taxes.getState()) / 100,
    });
    const euroRate = createModel(0.8);
    const netSalaryInEuros = createVirtualModel({
      models: [netSalary, euroRate],
      handler: () => euroRate.getState() * netSalary.getState(),
    });
    const callback = jest.fn();

    netSalaryInEuros.subscribe(callback);
    taxes.dispatch(40);

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(48_000, defaultdispatchConfigs);

    euroRate.dispatch(0.5);

    expect(callback).toBeCalledTimes(2);
    expect(callback).lastCalledWith(30_000, defaultdispatchConfigs);
  });

  test('changing virtual models dependency models', () => {
    const grossSalary = createModel(100_000);
    const taxes = createModel(20);
    const netSalary = createVirtualModel({
      handler: () => grossSalary.getState() * (100 - taxes.getState()) / 100,
    });

    expect(netSalary.getState()).toBe(80_000);

    netSalary.setOptions({ models: [grossSalary] });
    grossSalary.dispatch(200_000);

    expect(netSalary.getState()).toBe(160_000);
  });
});
