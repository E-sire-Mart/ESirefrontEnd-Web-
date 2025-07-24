"use client";

export const getLocation = () => {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        res({ longitude, latitude });
      },
      (error) => {
        rej(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};
