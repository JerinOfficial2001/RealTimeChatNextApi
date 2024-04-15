import { API } from "@/src/Api";

export const getContactByUserId = async (id) => {
  try {
    const response = await fetch(API + `/api/contact?user_id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => res.json());
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const addContact = async (
  ContactDetails,
  user_id,
  name,
  Contact_id,
  props
) => {
  try {
    const response = await fetch(API + "/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ ContactDetails, user_id, name, Contact_id }),
    }).then((res) => res.json());
    if (response.status == "error") {
      if (response.message === "already registered") {
        props.navigation.navigate("Message", {
          id: response.data,
        });
      } else {
        return response.data;
      }
    } else {
      if (response.status == "ok") {
        props.navigation.navigate("Home");
      } else {
        console.log(response);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export const deleteContactById = async (sender_id, receiver_id, contact_id) => {
  try {
    const response = await fetch(
      API +
        `/api/contact?sender_id=${sender_id}&receiver_id=${receiver_id}&Contact_id=${contact_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((res) => res.json());

    return response;
  } catch (error) {
    console.log(error);
  }
};
