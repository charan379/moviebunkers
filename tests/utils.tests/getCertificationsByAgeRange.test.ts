import getCertificationsByAgeRange from '@utils/getCertificationsByAgeRange';
import Country from '@constants/country.enum';

describe('getCertificationsByAgeRange', () => {
    it('returns an array of certifications within the given age range and country', async () => {
        const certifications = await getCertificationsByAgeRange(13, 21, Country.INDIA);
        expect(certifications).toEqual(['U/A 13+', 'U/A 16+', 'UA', 'A', 'S', 'MB-26']);
    });

    it('throws an error if age ratings are not found for the given country', async () => {
        await expect(getCertificationsByAgeRange(18, 21, 'INVALID_COUNTRY' as Country)).rejects.toThrow('Age ratings for country INVALID_COUNTRY not found');
    });

    it('returns an empty array if no certifications match the given age range', async () => {
        const certifications = await getCertificationsByAgeRange(0, 5, Country.GERMANY);
        expect(certifications).toEqual(["0"]);
    });
});
