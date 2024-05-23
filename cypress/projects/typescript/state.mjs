/* eslint-disable no-console */

export let counter = 0;

export function increment() {
  window.counter = ++counter;

  console.log('incremented', window.counter);
}
