import axios, { AxiosResponse } from "axios";
import { PrivateRooms, RoomsType } from "../types/Rooms";
import { ID } from "../types/PublicTypes";
import { getItemFromLS } from "./helpers/localStorageHelpers";

const BASE_URL = "http://localhost:5000";

const currentUser = getItemFromLS("user");

type ReturnData = "filteredPrivateRooms" | "filteredRooms";

interface Data<T> extends AxiosResponse {
  data: Record<ReturnData, T> & { message: string };
}

export const getFilteredUsers = (name: string): Promise<Data<PrivateRooms>> => {
  return axios.post(`${BASE_URL}/private-rooms`, {
    currentUserName: currentUser && currentUser.name,
    name,
  });
};

export const getFilteredChats = (
  arrayOfIds: ID[],
  name: string,
): Promise<Data<RoomsType>> => {
  return axios.post(`${BASE_URL}/rooms`, {
    arrayOfIds,
    name,
  });
};
