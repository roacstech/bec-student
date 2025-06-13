// Polyfill for AWS SDK in browser environment
if (typeof window !== 'undefined') {
  window.global = window;
  import('buffer').then(({ Buffer }) => {
    window.Buffer = window.Buffer || Buffer;
  });
  window.process = window.process || { env: {} };
}

export {};
