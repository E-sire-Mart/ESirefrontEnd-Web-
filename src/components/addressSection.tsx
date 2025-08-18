import React, { useEffect, useState } from "react";
import './AddressSelection.css';
import { GOOGLE_MAP_API_KEY } from "../services/url";
import axios from "axios";
import { Input, Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

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

  const createChangeHandler = (fieldId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange({
      ...e,
      target: {
        ...e.target,
        id: fieldId
      }
    });
  };

  const handleAddressConfirm = () => {
    const fullAddress = `${formData.location}, ${formData.locality}, ${formData.administrative_area_level_1}, ${formData.postal_code}, ${formData.country}`;
    console.log(fullAddress);
    onAddressSelect(fullAddress);
  };

  return (
    <div className="flex flex-row justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <EnvironmentOutlined className="text-3xl text-blue-500 mb-2" />
          <h3 className="text-xl font-semibold text-gray-800">Select Address</h3>
          <p className="text-gray-600">Please provide your delivery address</p>
        </div>
        
        <div className="space-y-4">
          <Input
            placeholder="Street Address"
            className="h-11"
            prefix={<EnvironmentOutlined className="text-gray-400" />}
            value={formData.location}
            onChange={createChangeHandler('location-input')}
          />
          <Input
            placeholder="City"
            className="h-11"
            prefix={<EnvironmentOutlined className="text-gray-400" />}
            value={formData.locality}
            onChange={createChangeHandler('locality-input')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="State/Province"
              className="h-11"
              prefix={<EnvironmentOutlined className="text-gray-400" />}
              value={formData.administrative_area_level_1}
              onChange={createChangeHandler('administrative_area_level_1-input')}
            />
            <Input
              placeholder="Postal Code"
              className="h-11"
              prefix={<EnvironmentOutlined className="text-gray-400" />}
              value={formData.postal_code}
              onChange={createChangeHandler('postal_code-input')}
            />
          </div>
          <Input
            placeholder="Country"
            className="h-11"
            prefix={<EnvironmentOutlined className="text-gray-400" />}
            value={formData.country}
            onChange={createChangeHandler('country-input')}
          />
        </div>
        
        <Button 
          type="primary" 
          onClick={handleAddressConfirm}
          className="w-full h-12 mt-6 bg-blue-500 border-blue-500"
          size="large"
        >
          Confirm Address
        </Button>
      </div>
    </div>
  );
};

export default AddressSelection;
