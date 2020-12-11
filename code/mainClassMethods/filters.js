import { requestTourismEventsCodes } from "../api/events";

const filterCode = (codes, language, type) => {
  return codes
    .filter((o) => o.Type === type)
    .map((o) => {
      return [o.TypeDesc[language], o.Bitmask];
    });
};

export async function getFilters() {
  this.listEventsTopics = await requestTourismEventsCodes();

  console.log(this.listEventsTopics);

  // // Category
  // const categories = filterCode(codes, this.language, "CategoryCodes");

  // // Facility Codes CreditCard
  // const facilityCodesCreditCard = filterCode(
  //   codes,
  //   this.language,
  //   "FacilityCodes_CreditCard"
  // );

  // // Facility Codes Features
  // const facilityCodesFeatures = filterCode(
  //   codes,
  //   this.language,
  //   "FacilityCodes_Equipment"
  // );

  // // Facility Codes Quality
  // const facilityCodesQuality = filterCode(
  //   codes,
  //   this.language,
  //   "FacilityCodes_QualitySeals"
  // );

  // // Facility Codes Cuisine
  // const facilityCodesCuisine = filterCode(codes, this.language, "CuisineCodes");

  // // Facility Codes Ceremony
  // const facilityCodesCeremony = filterCode(
  //   codes,
  //   this.language,
  //   "CeremonyCodes"
  // );

  // this.categories = categories;
  // this.facilityCodesCreditCard = facilityCodesCreditCard;
  // this.facilityCodesFeatures = facilityCodesFeatures;
  // this.facilityCodesQuality = facilityCodesQuality;
  // this.facilityCodesCuisine = facilityCodesCuisine;
  // this.facilityCodesCeremony = facilityCodesCeremony;
}
