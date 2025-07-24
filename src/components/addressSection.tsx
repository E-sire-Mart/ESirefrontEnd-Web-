import React, { useEffect, useState } from "react";
import './AddressSelection.css';
import { GOOGLE_MAP_API_KEY } from "../services/url";
import axios from "axios";

interface MapOptions {
  center: google.maps.LatLngLiteral; // or google.maps.LatLng
  fullscreenControl: boolean;
  mapTypeControl: boolean;
  streetViewControl: boolean;
  zoom: number;
  zoomControl: boolean;
  maxZoom: number;
  mapId: string;
}

interface Configuration {
  ctaTitle: string;
  mapOptions: MapOptions;
  mapsApiKey: string;
  capabilities: {
    addressAutocompleteControl: boolean;
    mapDisplayControl: boolean;
    ctaControl: boolean;
  };
}

const AddressSelection: React.FC<{ lat: number; lng: number; onAddressSelect: (address: string) => void }> = ({ lat, lng, onAddressSelect }) => {
  // State to store form values
  const [formData, setFormData] = useState({
    location: "",
    locality: "",
    administrative_area_level_1: "",
    postal_code: "",
    country: ""
  });

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}`
      );
      const data = response.data;
      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const newFormData = extractAddressComponents(addressComponents);
        setFormData(newFormData);
      } else {
        console.log("No results found for the provided lat/lng");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const extractAddressComponents = (components: any) => {
    let location = "";
    let locality = "";
    let administrative_area_level_1 = "";
    let postal_code = "";
    let country = "";

    components.forEach((component: any) => {
      if (component.types.includes("street_number") || component.types.includes("route")) {
        location += component.long_name + " ";
      }
      if (component.types.includes("locality")) {
        locality = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        administrative_area_level_1 = component.long_name;
      }
      if (component.types.includes("postal_code")) {
        postal_code = component.long_name;
      }
      if (component.types.includes("country")) {
        country = component.long_name;
      }
    });

    return { location: location.trim(), locality, administrative_area_level_1, postal_code, country };
  };

  useEffect(() => {
    if (lat && lng) {
      fetchAddress(lat, lng);
    }
  }, [lat, lng]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id.split('-')[0]]: value,
    });
  };

  const handleAddressConfirm = () => {
    const fullAddress = `${formData.location}, ${formData.locality}, ${formData.administrative_area_level_1}, ${formData.postal_code}, ${formData.country}`;
    console.log(fullAddress);
    onAddressSelect(fullAddress);
  };

  return (
    <div className="flex flex-row justify-center items-center p-[20px]">
      <div className="panel bg-white box-border p-[20px] flex flex-col justify-between gap-[15px] w-[400px] rounded-[8px]">
        <div className="flex items-center">
          <img
            className="mr-[8px]"
            src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg"
            alt="Address Icon"
          />
          <div className="sb-title">Select Address</div>
        </div>
        <input
          className="address-input"
          type="text"
          placeholder="Address"
          id="location-input"
          value={formData.location}
          onChange={handleInputChange}
        />
        <input
          className="address-input"
          type="text"
          placeholder="City"
          id="locality-input"
          value={formData.locality}
          onChange={handleInputChange}
        />
        <div className="half-input-container">
          <input
            type="text"
            className="half-input address-input"
            placeholder="State/Province"
            id="administrative_area_level_1-input"
            value={formData.administrative_area_level_1}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="half-input address-input"
            placeholder="Zip/Postal code"
            id="postal_code-input"
            value={formData.postal_code}
            onChange={handleInputChange}
          />
        </div>
        <input
          className="address-input"
          type="text"
          placeholder="Country"
          id="country-input"
          value={formData.country}
          onChange={handleInputChange}
        />
        <button className="checkout-btn bg-blue-500 hover:bg-blue-600 text-white cursor-pointer rounded-[5px] text-[16px] border-none p-[10px] transition-[0.3s]" onClick={handleAddressConfirm}>
          Confirm Address
        </button>
      </div>
    </div>
  );
};

export default AddressSelection;
