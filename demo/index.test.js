import { add, delayFunc } from './index';

test('test add function', () => {
  const sum = add(1, 2);
  expect(sum).toBe(3);
})

test('test rount number', () => {
  const sum = 0.1 + 0.2;

  expect(sum).toBeCloseTo(0.3);
  // expect(sum).toBe(0.3);
});

test('test random number', () => {
  const randomNumber = Math.random() * 100;

  expect(randomNumber).toBeGreaterThan(0);
  expect(randomNumber).toBeLessThan(100);
});

test('test delay function', () => {
  expect.assertions(1);

  delayFunc((status) => {
    console.log('here');
    expect(status).toBe('success');
  });
})
