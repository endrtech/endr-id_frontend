import axios from "axios";

export const getAppConfig = async (clientId: any) => {
  const response = await axios.get(
    `http://localhost:3050/api/invoke-oauth/${clientId}`,
  );

  if (response.status === 200) {
    return response.data;
  } else {
    return 400;
  }
};
