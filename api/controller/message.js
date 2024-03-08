const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API;
export const getAllMessages = async (chatID) => {
  try {
    const response = await fetch(AUTH_API + "/api/message", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }).then((res) => res.json());
    if (response.status == "ok") {
      const filteredMsg = response.data.filter((msg) => msg.chatID == chatID);
      if (filteredMsg) {
        return filteredMsg;
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};
export const deleteMessage = async (id) => {
  try {
    const response = await fetch(`${AUTH_API}/api/message?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }).then((res) => res.json());
    if (response.status == "ok") {
      return response;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};
