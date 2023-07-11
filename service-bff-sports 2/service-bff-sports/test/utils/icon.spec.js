const { generateSportIcon } = require(`${global.SRC}/utils`);

describe('Utils - Icon', () => {
  describe('generateSportIcon', () => {
    it('Should return icon based on Sport Name', () => {
      const sport = {
        name: 'AFL Football',
      };

      const icon = generateSportIcon(sport);
      icon.appIconIdentifier.should.eql('afl_football');
      icon.imageURL.should.eql('');
      icon.keepOriginalColor.should.eql(false);
    });

    it('Should return empty icon skeleton if Sport is not passed', () => {
      const icon = generateSportIcon();
      icon.appIconIdentifier.should.eql('');
      icon.imageURL.should.eql('');
      icon.keepOriginalColor.should.eql(false);
    });
  });
});
