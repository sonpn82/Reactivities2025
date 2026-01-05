interface Activity {
  id: string
  title: string
  date: Date,
  description: string
  category: string
  isCancelled: boolean
  city: string
  venue: string
  latitude: number
  longitude: number

}

interface CreateActivityDto {
  title: string
  date: Date,
  description: string
  category: string
  city?: string
  venue: string
  latitude: number
  longitude: number
}

interface LocationIQSuggestion {
  place_id: string
  osm_id: string
  osm_type: string
  licence: string
  lat: string
  lon: string
  boundingbox: string[]
  class: string
  type: string
  display_name: string
  display_place: string
  display_address: string
  address: LocationIQAddress
}

interface LocationIQAddress {
  name: string
  house_number: string
  road: string
  suburb?: string
  town?: string
  village?: string
  city?: string
  county: string
  state: string
  postcode: string
  country: string
  country_code: string
  neighbourhood?: string
}