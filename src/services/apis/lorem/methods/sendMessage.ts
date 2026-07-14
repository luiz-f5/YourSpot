import api from "../lorem";

const sendMessage: () => Promise<any> = async () => {
  try {
    const response = await api.get("/lorem");
    const data: any = await response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};

export default sendMessage;
