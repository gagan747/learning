const { fieldSorter, orderItems, partition } = require(`${global.SRC}/utils`);

describe('Utils - Array', () => {
  describe('Sort', () => {
    const items = [
      { title: 'Al-nahda (Ksa) v Najran SC', startTime: '2022-03-22T15:30:00.000Z' },
      { title: 'Martin A v Balserani', startTime: '2022-03-22T15:17:40.000Z' },
      { title: 'Guinard v Zeppieri', startTime: '2022-03-22T15:30:00.000Z' },
      { title: 'Paul/Steinegger v Galloway/Withrow', startTime: '2022-03-22T15:15:00.000Z' },
      { title: 'Daniel T v Fratangelo', startTime: '2022-03-22T15:15:52.000Z' },
      { title: 'Munar v Ymer E', startTime: '2022-03-22T15:16:30.000Z' },
      { title: 'Anderson K v Krueger', startTime: '2022-03-22T15:19:43.000Z' },
      { title: 'Mayot v Tatlot', startTime: '2022-03-22T15:30:00.000Z' },
      { title: 'Ng T v Oliynykova', startTime: '2022-03-22T15:30:00.000Z' },
      { title: 'Herazo Gonzalez v Inoue', startTime: '2022-03-22T15:30:00.000Z' },
      { title: 'Monroy v Estable', startTime: '2022-03-22T15:30:00.000Z' },
      { title: 'Samudio v Ccuno', startTime: '2022-03-22T15:30:00.000Z' },
      { title: 'Pakistan v Australia', startTime: '2022-03-22T05:00:00.000Z' },
      { title: 'Qiu v Gauzy Simon', startTime: '2022-03-22T15:15:00.000Z' },
      { title: 'USK Praha v SBS Ostrava', startTime: '2022-03-22T15:30:00.000Z' },
    ];
    it('Should order list of items in ASC order', () => {
      const sorted = orderItems(items, 'asc', 'startTime');
      sorted[0].title.should.eql('Pakistan v Australia');
      sorted[1].title.should.eql('Paul/Steinegger v Galloway/Withrow');
      sorted[13].title.should.eql('Samudio v Ccuno');
      sorted[14].title.should.eql('USK Praha v SBS Ostrava');
    });
    it('Should order list of items in DESC order', () => {
      const sorted = orderItems(items, 'desc', 'startTime');
      sorted[0].title.should.eql('Al-nahda (Ksa) v Najran SC');
      sorted[1].title.should.eql('Guinard v Zeppieri');
      sorted[13].title.should.eql('Qiu v Gauzy Simon');
      sorted[14].title.should.eql('Pakistan v Australia');
    });
    it('Should not mutuate the original list', () => {
      const sorted = orderItems(items, 'asc', 'startTime');
      sorted[0].title.should.eql('Pakistan v Australia');
      sorted[1].title.should.eql('Paul/Steinegger v Galloway/Withrow');

      items[0].title.should.eql('Al-nahda (Ksa) v Najran SC');
      items[1].title.should.eql('Martin A v Balserani');
    });
  });

  describe('fieldSorter', () => {
    const data = [
      { displayName: 'Cat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-03T00:00:00Z' },
      { displayName: 'Bat', startTime: '2020-03-01T00:00:00Z', closeTime: '2020-03-02T00:00:00Z' },
      { displayName: 'Cat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
      { displayName: 'Dog', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-02T00:00:00Z' },
      { displayName: 'Cat', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-03T00:00:00Z' },
      { displayName: 'Dog', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
      { displayName: 'Bat', startTime: '2020-03-01T00:00:00Z', closeTime: '2020-03-03T00:00:00Z' },
      { displayName: 'Dog', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-03T00:00:00Z' },
      { displayName: 'Bat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
    ];

    it('sorts by displayName', () => {
      [...data].sort(fieldSorter('displayName')).should.eql([
        { displayName: 'Bat', startTime: '2020-03-01T00:00:00Z', closeTime: '2020-03-02T00:00:00Z' },
        { displayName: 'Bat', startTime: '2020-03-01T00:00:00Z', closeTime: '2020-03-03T00:00:00Z' },
        { displayName: 'Bat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
        { displayName: 'Cat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-03T00:00:00Z' },
        { displayName: 'Cat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
        { displayName: 'Cat', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-03T00:00:00Z' },
        { displayName: 'Dog', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-02T00:00:00Z' },
        { displayName: 'Dog', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
        { displayName: 'Dog', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-03T00:00:00Z' },
      ]);
    });

    it('sorts by displayName then by startTime', () => {
      [...data].sort(fieldSorter('displayName', 'startTime')).should.eql([
        { displayName: 'Bat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
        { displayName: 'Bat', startTime: '2020-03-01T00:00:00Z', closeTime: '2020-03-02T00:00:00Z' },
        { displayName: 'Bat', startTime: '2020-03-01T00:00:00Z', closeTime: '2020-03-03T00:00:00Z' },
        { displayName: 'Cat', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-03T00:00:00Z' },
        { displayName: 'Cat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-03T00:00:00Z' },
        { displayName: 'Cat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
        { displayName: 'Dog', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-02T00:00:00Z' },
        { displayName: 'Dog', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-03T00:00:00Z' },
        { displayName: 'Dog', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
      ]);
    });

    it('sorts by displayName then by startTime then by closeTime', () => {
      [...data].sort(fieldSorter('displayName', 'startTime', 'closeTime')).should.eql([
        { displayName: 'Bat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
        { displayName: 'Bat', startTime: '2020-03-01T00:00:00Z', closeTime: '2020-03-02T00:00:00Z' },
        { displayName: 'Bat', startTime: '2020-03-01T00:00:00Z', closeTime: '2020-03-03T00:00:00Z' },
        { displayName: 'Cat', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-03T00:00:00Z' },
        { displayName: 'Cat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
        { displayName: 'Cat', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-03T00:00:00Z' },
        { displayName: 'Dog', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-02T00:00:00Z' },
        { displayName: 'Dog', startTime: '2020-01-01T00:00:00Z', closeTime: '2020-01-03T00:00:00Z' },
        { displayName: 'Dog', startTime: '2020-02-01T00:00:00Z', closeTime: '2020-02-02T00:00:00Z' },
      ]);
    });
  });

  describe('partition', () => {
    it('can create odd and even partitions', () => {
      partition([1, 2, 3, 4, 5, 6], (n) => n % 2).should.eql([[1, 3, 5], [2, 4, 6]]);
    });
  });
});
