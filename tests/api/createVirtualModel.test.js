import { createModel, createVirtualModel } from 'src';

describe('Creating a Virtual Model', () => {
  test('model object pass match pattern', () => {
    const first = createModel('first');
    const second = createModel('second');
    const processor = jest.fn(() => {});

    const virtualModel = createVirtualModel(processor, { models: [first, second] });

    expect(processor).toBeCalledTimes(0);
    expect(typeof virtualModel).toBe('object');
    expect(typeof virtualModel.getState).toBe('function');
    expect(typeof virtualModel.subscribe).toBe('function');
  });

  test('Get state must give the default state, when nothing published', () => {
    const name = createModel('Foo');
    const surname = createModel('Bar');
    const fullname = createVirtualModel(
      () => `${name.getState()} ${surname.getState()}`,
      {
        models: [name, surname],
      },
    );

    expect(fullname.getState()).toBe('Foo Bar');
  });

  test('State must be updated after publishment(primitive value)', () => {
    const grossSalary = createModel(100_000);
    const taxes = createModel(20);
    const netSalary = createVirtualModel(
      () => grossSalary.getState() * (100 - taxes.getState()) / 100,
      { models: [grossSalary, taxes] }
    );

    expect(netSalary.getState()).toBe(80_000);

    grossSalary.publish(200_000);

    expect(netSalary.getState()).toBe(160_000);
  });

  test('State must be updated after publishment(by function)', () => {
    const grossSalary = createModel(100_000);
    const taxes = createModel(20);
    const netSalary = createVirtualModel(
      () => grossSalary.getState() * (100 - taxes.getState()) / 100,
      { models: [grossSalary, taxes] }
    );

    expect(netSalary.getState()).toBe(80_000);

    taxes.publish(() => 40);

    expect(netSalary.getState()).toBe(60_000);
  });

  test('Subscribe method must be fired when value published', () => {
    const value1 = 'Peter';
    const model1 = createModel(value1);
    const value2 = 20;
    const model2 = createModel(value2);
    const value3 = { city: 'New York' };
    const model3 = createModel(value3);
    const virtual = createVirtualModel(
      () => `${model1.getState()} is alone in ${model3.getState().city} at his ${model2.getState()}`,
      { models: [model1, model2, model3] }
    );
    const callback = jest.fn();
    const nextValue2 = 80;
    const nextValue3 = { city: 'Tokio' };

    virtual.subscribe(callback);
    model2.publish(nextValue2);

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(`${value1} is alone in ${value3.city} at his ${nextValue2}`);

    model3.publish(nextValue3);

    expect(callback).toBeCalledTimes(2);
    expect(callback).lastCalledWith(`${value1} is alone in ${nextValue3.city} at his ${nextValue2}`);
  });

  test('It must be possible to create virtualModel over virtual model', () => {
    const grossSalary = createModel(100_000);
    const taxes = createModel(20);
    const netSalary = createVirtualModel(
      () => grossSalary.getState() * (100 - taxes.getState()) / 100,
      { models: [grossSalary, taxes] }
    );
    const euroRate = createModel(0.8);
    const netSalaryInEuros = createVirtualModel(
      () => euroRate.getState() * netSalary.getState(),
      { models: [netSalary, euroRate] }
    );
    const callback = jest.fn();

    netSalaryInEuros.subscribe(callback);
    taxes.publish(40);

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(48_000);

    euroRate.publish(0.5);

    expect(callback).toBeCalledTimes(2);
    expect(callback).lastCalledWith(30_000);
  });

  test('changing virtual models dependency models', () => {
    const grossSalary = createModel(100_000);
    const taxes = createModel(20);
    const netSalary = createVirtualModel(
      () => grossSalary.getState() * (100 - taxes.getState()) / 100,
    );

    expect(netSalary.getState()).toBe(80_000);

    netSalary.setOptions({ models: [grossSalary] });
    grossSalary.publish(200_000);

    expect(netSalary.getState()).toBe(160_000);
  });

  test('virtual models must not be updated if the model is not in the dependencies', () => {
    const grossSalary = createModel(100_000);
    const taxes = createModel(20);
    const netSalary = createVirtualModel(
      () => grossSalary.getState() * (100 - taxes.getState()) / 100,
    );

    expect(netSalary.getState()).toBe(80_000);

    netSalary.setOptions({ models: [grossSalary] });
    grossSalary.publish(200_000);

    expect(netSalary.getState()).toBe(160_000);

    taxes.publish(50);

    expect(netSalary.getState()).toBe(160_000);
  });
});
