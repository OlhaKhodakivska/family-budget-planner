declare module 'node:assert/strict' {
  interface AssertStrict {
    equal(actual: unknown, expected: unknown, message?: string): void;
    deepEqual(actual: unknown, expected: unknown, message?: string): void;
  }

  const assert: AssertStrict;
  export default assert;
}

declare module 'node:test' {
  const test: (name: string, callback: () => void | Promise<void>) => void;
  export default test;
}
