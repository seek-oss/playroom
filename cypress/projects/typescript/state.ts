/* eslint-disable no-console */

declare global {
  interface Window {
    counter: number;
  }
}

window.counter = 0;

export function increment() {
  window.counter++;

  console.log('incremented', window.counter);
}
