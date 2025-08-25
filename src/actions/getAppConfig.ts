import axios from "axios";

export const getAppConfig = async (clientId: any) => {
  const response = await axios.get(
    `https://api.id.endr.com.au/api/invoke-oauth/${clientId}`,
  );

  if (response.status === 200) {
    return response.data;
  } else {
    return 400;
  }
};
