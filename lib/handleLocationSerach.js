const handleLocationSearch = (
  selectedLocation,
  form,
  setIsCloseSearch,
  setSearchLocation,
  placesService,
) => {
  placesService?.getDetails(
    { placeId: selectedLocation.place_id },
    (placeDetails) => {
      const getComponentByType = (type) => {
        return placeDetails.address_components.find((component) =>
          component.types.includes(type),
        );
      };
      // Extract city, state, postal code, and country code
      const cityComponent = getComponentByType("locality");
      const stateComponent = getComponentByType("administrative_area_level_1");
      const postalCodeComponent = getComponentByType("postal_code");
      // const countryComponent = getComponentByType('country');

      const city = cityComponent ? cityComponent.long_name : "";
      const state = stateComponent ? stateComponent.long_name : "";
      const postalCode = postalCodeComponent
        ? postalCodeComponent.long_name
        : "";

      form.setValue("city", city);
      form.setValue("state", state);
      form.setValue("postal_code", postalCode);
      form.clearErrors();
      setIsCloseSearch(false);
    },
  );
  form.setValue("street_address", selectedLocation?.description.split(",")[0]);
  setSearchLocation(selectedLocation?.description.split(",")[0]);
};
 export default handleLocationSearch