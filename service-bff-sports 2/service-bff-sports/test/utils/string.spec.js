const {
  escapeHtml, removeHTMLWhitespaces, removeCSSWhitespaces, compareAppVersion,
} = require(`${SRC}/utils/string`);

describe('escapeHtml', () => {
  it('escapes HTML tags', () => {
    escapeHtml('<script>stealCreditCard();</script>').should.equal('&lt;script&gt;stealCreditCard();&lt;&#x2F;script&gt;');
  });

  it('ignores existing HTML entities', () => {
    escapeHtml('"Terms &amp; Conditions"').should.equal('&quot;Terms &amp; Conditions&quot;');
  });

  it('Should allow line breaks (<br>, <br/>) if required', () => {
    const allowLineBreaks = true;
    const html = '"Terms &amp; Conditions <br>Lorem ipsum dolor <br /> sit <br/> amet."';
    escapeHtml(html, allowLineBreaks).should.equal('&quot;Terms &amp; Conditions <br/>Lorem ipsum dolor <br/> sit <br/> amet.&quot;');
  });
});

describe('removeHTMLWhitespaces', () => {
  it('Should remove whitespaces between html tags', () => {
    removeHTMLWhitespaces(`
      <html>
        <body>
          <div class='hello world'>
            <span></span> <p>Hello</p>
          </div>
        </body>
      </html>
    `).should.eql('<html><body><div class=\'hello world\'><span></span><p>Hello</p></div></body></html>');
  });
  it('Should not remove whitespaces within content', () => {
    removeHTMLWhitespaces(`
      <html>
        <body>
          <div class='hello world'>
            This is some
            Dummy       Text
            <img src='https://somedomain/funny.jpeg'>
          </div>
        </body>
      </html>
    `).should.eql('<html><body><div class=\'hello world\'>            This is some            Dummy       Text<img src=\'https://somedomain/funny.jpeg\'></div></body></html>');
  });
});

describe('removeCSSWhitespaces', () => {
  it('Should remove whitespaces between styles ad rules', () => {
    removeCSSWhitespaces(`
      div {
        padding: 10px;
        margin-bottom:   400px;
        padding: 0;
      }


      p {
        font-family: sans-serif;
      }
    `).should.eql('div{padding:10px;margin-bottom:400px;padding:0;}p{font-family:sans-serif;}');
  });

  it('Should not remove whitespaces between multi-value rules', () => {
    removeCSSWhitespaces(`
      div {
        padding: 10px 20px 10px 40px;
        margin: 0 400px 20px 30px;
        padding: 0 40rem;
      }


      p {
        font-family: 'Inter', sans-serif;
      }
    `).should.eql('div{padding:10px 20px 10px 40px;margin:0 400px 20px 30px;padding:0 40rem;}p{font-family:\'Inter\',sans-serif;}');
  });
});

describe('compareAppVersion function to get correct value', () => {
  it('gives 0 for same version', () => {
    compareAppVersion('12.2.0', '12.2.0').should.equal(0);
  });

  it('gives 1 if appVersion is greater than fetaureVersion', () => {
    compareAppVersion('12.2.1', '12.2.0').should.equal(1);
    compareAppVersion('12.12.1', '12.2.0').should.equal(1);
    compareAppVersion('12.2.10', '12.2.9').should.equal(1);
    compareAppVersion('12.1.0', '12.0.1').should.equal(1);
    compareAppVersion('12.1.0', '0.0.0').should.equal(1);
  });

  it('gives -1 if appVersion is less than fetaureVersion', () => {
    compareAppVersion('12.2.0', '12.2.1').should.equal(-1);
    compareAppVersion('12.12.1', '12.13.0').should.equal(-1);
    compareAppVersion('12.2.9', '12.2.10').should.equal(-1);
    compareAppVersion('0.0.0', '12.0.1').should.equal(-1);
  });
});
