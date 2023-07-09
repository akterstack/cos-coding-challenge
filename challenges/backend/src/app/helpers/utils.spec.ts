import { expect } from 'chai';
import { calcAverage } from './utils';

describe('Helper/util functions', () => {
  describe('#calcAverage', () => {
    it('should return 0 for empty number array.', () => {
      const sampleNumbers: number[] = [];
      expect(calcAverage(sampleNumbers)).to.be.equal(0);
    });
  });

  describe('#calcAverage', () => {
    it('should calculate average of numbers provided.', () => {
      const sampleNumbers = [4, 6, 7, 5, 8];
      expect(calcAverage(sampleNumbers)).to.be.equal(6);
    });
  });
});
