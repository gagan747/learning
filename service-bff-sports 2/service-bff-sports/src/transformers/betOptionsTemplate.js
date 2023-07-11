const templateMapping = {
  'head to head': 'sports.propositions.horizontal',
  result: 'sports.propositions.horizontal',
};

const _iconIncluded = ['sports.propositions.horizontal'];

const iconIncluded = (template) => _iconIncluded.includes(template);

const getTemplate = (betType = '') => {
  if (!betType) {
    return 'sports.propositions.empty';
  }
  return templateMapping[betType.toLowerCase()] || 'sports.propositions.vertical';
};

module.exports = { getTemplate, iconIncluded };
