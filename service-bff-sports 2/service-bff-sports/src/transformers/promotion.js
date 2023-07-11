const { escapeHtml, removeCSSWhitespaces, removeHTMLWhitespaces } = require('../utils/string');

const script = `
  function invokeNative() {
    if (MessageInvoker && typeof MessageInvoker.postMessage === 'function') {
      MessageInvoker.postMessage('Bet now');
    }
  }
`;

const style = `
  html {
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-style: normal;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    display: flex;
    flex-direction: column;
    margin: 0;
    min-height: 100vh;
  }

  img {
    display: block;
    height: auto;
    max-width: 100%;
  }

  .content {
    color: rgba(51, 51, 51, 0.69);
    flex: 1;
    font-weight: 400;
    margin: 2rem 1rem 1rem 1rem;
  }

  .footer {
    background: #ffffff;
    bottom: 0;
    padding: 1.5rem 1rem 1rem 1rem;
    position: sticky;
    width: 100%;
  }

  .learn-more {
    margin-bottom: 3.75rem;
    text-align: center;
  }

  .terms {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .bet-now {
    background: #008542;
    border: none;
    border-radius: 6px;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25rem;
    padding: 0.75rem 1rem;
    width: 100%;
  }

  .learn-more-title {
    color: #191919;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.5rem;
    margin-bottom: 1rem;
  }

  .learn-more-details {
    font-size: 1rem;
    line-height: 1.25rem;
  }

  .terms-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
`;

const toPromoHtmlPage = ({
  learnMoreImage,
  learnMoreTitle,
  learnMoreDetails,
  termsAndCondition,
  betNowText,
}) => removeHTMLWhitespaces(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script type="text/javascript">${removeCSSWhitespaces(script)}</script>
      <style>${removeCSSWhitespaces(style)}</style>
    </head>
    <body>
      <img src="${escapeHtml(learnMoreImage)}" />
      <div class="content">
        <div class="learn-more">
          <div class="learn-more-title">${escapeHtml(learnMoreTitle)}</div>
          <div class="learn-more-details">${escapeHtml(learnMoreDetails, true)}</div>
        </div>
        <div class="terms">
          <div class="terms-title">Terms & Conditions</div>
          <div>${escapeHtml(termsAndCondition, true)}</div>
        </div>
      </div>
      <div class="footer">
        <button type="button" class="bet-now" onclick="invokeNative()">${escapeHtml(betNowText)}</button>
      </div>
    </body>
  </html>
`);

module.exports = {
  toPromoHtmlPage,
};
