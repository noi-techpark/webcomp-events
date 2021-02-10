export async function requestGetCoordinatesFromSearch(query) {
  const r = 150 * 1000;
  try {
    if (query) {
      const hereResponse = await fetch(
        `https://places.ls.hereapi.com/places/v1/browse?apiKey=${process.env.TILES_API_KEY}&in=46.31,11.26;r=${r}&q=${query}`,
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
          }),
        }
      );
      const hereData = await hereResponse.json();
      const formattedHereData = hereData.results.items.map((item) => {
        return {
          position: item.position,
          title: item.title,
        };
      });

      //

      const tourismResponse = await fetch(
        `https://tourism.opendatahub.bz.it/api/Poi?pagenumber=1&pagesize=10000&poitype=511&searchfilter=${query}`,
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
          }),
        }
      );
      const tourismData = await tourismResponse.json();
      const formattedTourismData = tourismData.Items.map((item) => {
        return {
          position: [item.GpsInfo[0].Latitude, item.GpsInfo[0].Longitude],
          title: item.Detail[this.language].Title,
        };
      });

      this.searchPlacesFound = [...formattedTourismData, ...formattedHereData];
    }
  } catch (error) {
    console.error(error);
    this.searchPlacesFound = [];
  }
}
