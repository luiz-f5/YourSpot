import api from "../services/api";

const sendMessage: () => Promise<any> = async () => {
  try {
    const response = await api.get("/lorem");
    const data: any = response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};

export default sendMessage;
