import { expect } from 'chai';

import { test } from './test';

describe('test', () => {
  it('works', () => {
    expect(test('something')).to.be.equal('test: something');
  });
});
