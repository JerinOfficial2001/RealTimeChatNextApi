import { getUserData } from "./auth";

export const getAlltokens = async () => {
  try {
    const response = await fetch("/api/auth/token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => res.json());
    if (response.status == "ok") {
      return response.data;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};
export const getTokenID = async () => {
  try {
    const response = await fetch("/api/auth/tokenID", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => res.json());
    if (response.status == "ok") {
      getTokenByID(response.data[0].tokenID).then((token) => {
        if (token) {
          getUserData(token[0].token);
          removeTokenID(response.data[0]._id);
        }
      });
    } else {
      console.log("Token:Err occured");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};
export const getTokenByID = async (id) => {
  try {
    const response = await fetch(`/api/auth/token?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => res.json());
    if (response.status == "ok") {
      return response.data;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};
export const removeTokenID = async (id) => {
  try {
    const response = await fetch(`/api/auth/tokenID?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => res.json());
    if (response.status == "ok") {
      return response.data;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};
