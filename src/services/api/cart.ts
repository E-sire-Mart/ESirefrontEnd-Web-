"use client";

import axios from "axios";
import { ORDERCREATEURL } from "../url";


export const orderCreate = async (billAmount: number) => {
  const userData = localStorage.getItem("user");

  if (userData) {
    const accessToken: any = JSON.parse(userData);

    const { data } = await axios.post(
      ORDERCREATEURL,
      {
        amount: billAmount - 15 + 2,
        currency: "INR",
        receipt: "receipt#1",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      }
    );

    console.log(data);

    return data;
  }
};
