import AgeRatings from '@constants/age.rattings';
import Country from '@constants/country.enum';

/**
 * Returns an array of certifications within the given age range and country.
 *
 * @param {number} lowerAgeLimit - The lower age limit of the certification.
 * @param {number} upperAgeLimit - The upper age limit of the certification.
 * @param {Country} country - The country for which certifications are required.
 * @returns {Promise<string[]>} - An array of certifications that match the given criteria.
 * @throws {Error} - If age ratings for the given country are not found.
 */
async function getCertificationsByAgeRange(lowerAgeLimit: number, upperAgeLimit: number, country: Country): Promise<string[]> {
  // Get the age ratings for the given country.
  const ageRatings = AgeRatings[country];

  // If no age ratings are found, throw an error.
  if (!ageRatings) {
    throw new Error(`Age ratings for country ${country} not found`);
  }

  // Filter the age ratings that match the given age range, and extract the certification values.
  const certifications = ageRatings
    .filter((rating: AgeRating) => rating.age[0] <= upperAgeLimit && rating.age[1] >= lowerAgeLimit)
    .map((rating: AgeRating) => rating.certification);

  return certifications;
}

export default getCertificationsByAgeRange;
