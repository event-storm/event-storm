import { createHistory, createModel, publishModel } from '../../src';

describe('Create history for models', () => {
  test('history object must match the pattern', () => {
    const grossSalary = createModel(100_000);
    const history = createHistory([grossSalary]);

    expect(typeof history.goBack).toBe('function');
    expect(typeof history.hasNext).toBe('function');
    expect(typeof history.goForward).toBe('function');
    expect(typeof history.hasPrevious).toBe('function');
  });

  test('history must be updated when model published', () => {
    const grossSalary = createModel(100_000);
    const taxes = createModel(20);
    const history = createHistory([grossSalary]);

    expect(history.hasPrevious()).toBe(false);
    expect(history.hasNext()).toBe(false);

    publishModel(grossSalary, 200_000);

    expect(history.hasPrevious()).toBe(true);
    expect(history.hasNext()).toBe(false);
  });

  test('history must not be updated when other model published', () => {
    const grossSalary = createModel(100_000);
    const taxes = createModel(20);
    const history = createHistory([grossSalary]);

    expect(history.hasPrevious()).toBe(false);
    expect(history.hasNext()).toBe(false);

    publishModel(taxes, 40);

    expect(history.hasPrevious()).toBe(false);
    expect(history.hasNext()).toBe(false);
  });

  describe('history goBack/goForward must update last model', () => {
    const initialGrossSalary = 100_000;
    const finalStateGrossSalary = 150_000;
    const grossSalary = createModel(initialGrossSalary);
    const taxes = createModel(20);
    const history = createHistory([grossSalary, taxes]);

    publishModel(taxes, 40);
    publishModel(grossSalary, finalStateGrossSalary);
    test('go back', () => {
      history.goBack();
      expect(grossSalary.getState()).toBe(initialGrossSalary);
    });
    test('go forward', () => {
      history.goForward();
      expect(grossSalary.getState()).toBe(finalStateGrossSalary);
    });
  });

  test('history overlap must change its length', () => {
    const initialGrossSalary = 100_000;
    const finalStateGrossSalary = 150_000;
    const grossSalary = createModel(initialGrossSalary);
    const taxes = createModel(20);
    const history = createHistory([grossSalary, taxes]);

    publishModel(taxes, 40);
    publishModel(grossSalary, finalStateGrossSalary);
    history.goBack();
    history.goBack();

    expect(history.hasNext()).toBe(true);

    publishModel(taxes, 40);

    expect(history.hasNext()).toBe(false);
  });
});
