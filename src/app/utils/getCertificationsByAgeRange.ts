import AgeRattings from "@constants/age.rattings";
import Country from "@constants/country.enum";


async function getCertificationsByAgeRange(lowerAgeLimit: Number, upperAgeLimit: Number, country: Country) {
  const certifications = AgeRattings?.[country].map(certification => {
    if (certification.age[0] <= upperAgeLimit && certification.age[1] >= lowerAgeLimit) return certification.certification
  }).filter(Boolean)

  return certifications;
}

export default getCertificationsByAgeRange;