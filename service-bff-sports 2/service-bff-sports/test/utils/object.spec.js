const { isDeeplyEmpty } = require(`${global.SRC}/utils/object`);

describe('Utils - Object', () => {
  describe('isDeeplyEmpty', () => {
    describe('returns true', () => {
      it('for {}', () => {
        isDeeplyEmpty({}).should.eql(true);
      });

      it('for { a: {} }', () => {
        isDeeplyEmpty({ a: {} }).should.eql(true);
      });

      it('for { a: {}, b: null }', () => {
        isDeeplyEmpty({ a: {}, b: null }).should.eql(true);
      });

      it('for undefined', () => {
        isDeeplyEmpty(undefined).should.eql(true);
      });

      it('for null', () => {
        isDeeplyEmpty(null).should.eql(true);
      });
    });

    describe('returns false', () => {
      it('for { a: 0 }', () => {
        isDeeplyEmpty({ a: 0 }).should.eql(false);
      });

      it('for { a: { b: 0 } }', () => {
        isDeeplyEmpty({ a: { b: 0 } }).should.eql(false);
      });

      it('for 0', () => {
        isDeeplyEmpty(0).should.eql(false);
      });

      it('for empty string', () => {
        isDeeplyEmpty('').should.eql(false);
      });

      it('for false', () => {
        isDeeplyEmpty(false).should.eql(false);
      });
    });
  });
});
