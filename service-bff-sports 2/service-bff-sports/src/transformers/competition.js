const getCompetitionData = (competitionList, eligiblePromotions) => {
  const compData = (competitionList.data || []).map((item) => {
    const promoAvailable = ((eligiblePromotions && eligiblePromotions.data) || [])
      .some((promo) => promo.competitionName === item.name);
    return {
      ...item,
      promoAvailable,
    };
  });
  return compData;
};

const getPromoData = (eligiblePromotions) => {
  const hasPromotions = eligiblePromotions && eligiblePromotions.data
      && eligiblePromotions.data.length;
  let promoData;
  if (hasPromotions) {
    const promos = (eligiblePromotions.data || [])
      .map((ele) => ({ ...ele, competitionName: undefined }));
    promoData = {
      ...eligiblePromotions,
      data: promos,
    };
  }
  return promoData;
};

module.exports = {
  getCompetitionData,
  getPromoData,
};
