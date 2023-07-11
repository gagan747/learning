const htmlEntityMap = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

const escapeHtml = (string = '', allowLineBreaks = false) => {
  const result = string.replace(/[<>"'`=/]/g, (s) => htmlEntityMap[s]);
  if (allowLineBreaks) {
    return result.replace(/&lt;br[ &#x2F;]*&gt;/g, '<br/>');
  }
  return result;
};

const removeCSSWhitespaces = (string = '') => string
  .trim()
  .replace(/\n/g, '')
  .replace(/[\t ]+\{/g, '{')
  .replace(/\}[\t ]+/g, '}')
  .replace(/\{[\t ]+/g, '{')
  .replace(/;[\t ]+/g, ';')
  .replace(/:[\t ]+/g, ':')
  .replace(/,[\t ]+/g, ',');

const removeHTMLWhitespaces = (string = '') => string
  .trim()
  .replace(/\n/g, '')
  .replace(/[\t ]+</g, '<')
  .replace(/>[\t ]+</g, '><')
  .replace(/>[\t ]+$/g, '>');

const compVersions = (oldVer, newVer) => {
  const oldParts = oldVer.split('.');
  const newParts = newVer.split('.');
  for (let i = 0; i < newParts.length; i++) {
    const a = +newParts[i];
    const b = +oldParts[i];
    if (a >= b && i === newParts.length - 1) {
      return true;
    }
    if (a < b) return false;
  }
  return false;
};

/** compareAppVersion compares appVersion with featureVersion, returns 0 if equal,
  1 if appVersion > featureVersion, else -1 * */
const compareAppVersion = (appVersion, featureVersion) => {
  let value = -1;
  if (appVersion && featureVersion) {
    value = (appVersion).localeCompare(featureVersion, undefined, { numeric: true, sensitivity: 'base' });
  }
  return value;
};

module.exports = {
  escapeHtml,
  removeCSSWhitespaces,
  removeHTMLWhitespaces,
  compVersions,
  compareAppVersion,
};
