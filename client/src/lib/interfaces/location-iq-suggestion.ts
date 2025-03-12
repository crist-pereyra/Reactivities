export interface LocationIQSuggestion {
  place_id: string;
  osm_id: string;
  osm_type: string;
  licence: string;
  lat: string;
  lon: string;
  boundingbox: string[];
  class: string;
  type: string;
  display_name: string;
  display_place: string;
  display_address: string;
  address: LocationIQAddress;
}

export interface LocationIQAddress {
  name: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  county: string;
  state: string;
  postcode?: string;
  country: string;
  country_code: string;
  town?: string;
  village?: string;
}
