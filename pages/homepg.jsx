import { getAllUsers } from "@/api/controller/auth";
import { createChat, getAllChats } from "@/api/controller/chats";
import { deleteMessage, getAllMessages } from "@/api/controller/message";
import ChatContainer from "@/src/components/ChatContainer";
import { DarkMode, LightMode } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function useSocket() {
  const SocketAPI = process.env.NEXT_PUBLIC_SOCKET_API;

  const [socketIo, setSocketIo] = useState(null);
  useEffect(() => {
    const socket = io(SocketAPI, {
      // path: "/socket",
    });
    setSocketIo(socket);
    return () => {
      socket.disconnect();
    };
  }, []);
  return socketIo;
}

export default function Homepg() {
  const router = useRouter();
  const [users, setusers] = useState([]);
  const [userData, setuserData] = useState({});
  const [formDatas, setformDatas] = useState({
    msg: "",
    userName: "",
  });
  const [isDarkMode, setisDarkMode] = useState(true);
  const [isHover, setisHover] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setmenuIndex] = useState(null);
  const [isActive, setisActive] = useState(false);
  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setmenuIndex(index);
  };
  const handleClose = (index) => {
    setAnchorEl(null);
    handleIsHoverClose(index);
  };
  const open = Boolean(anchorEl);

  const handleOnchange = (event) => {
    const { value, name } = event.target;
    setformDatas({
      ...formDatas,
      [name]: value,
    });
  };

  const [chatArray, setchatArray] = useState([]);
  const [currentChatPg, setcurrentChatPg] = useState({});
  const socket = useSocket();
  const [activeUsers, setactiveUsers] = useState([]);
  const [MsgLength, setMsgLength] = useState([]);
  useEffect(() => {
    if (socket) {
      socket.on("connection", () => {
        console.log("connected");
      });
      socket.emit("set_user_id", userData._id);
      socket.on("disconnect", () => {
        console.log("disconnect");
      });
      socket.emit("user_connected", { id: userData._id, status: "online" });
      socket.on("user_connected", (data) => {
        setactiveUsers(data);
      });
      socket?.on("receivedMsg", (message) => {
        // Display notification
        if ("Notification" in window && message.sender !== userData._id) {
          // Ask for permission if needed
          Notification.requestPermission().then((result) => {
            if (result === "granted") {
              new Notification(getUserNameByID(message.sender), {
                body: message.message,
              });
            }
          });
        }
      });

      // Cleanup on unmount
      return () => {
        socket?.off("receive_message");
      };
    }
  }, [socket]);
  useEffect(() => {
    // Listen for new messages
  }, []);

  const handleSocket = async () => {
    if (socket) {
      socket.on("message", (data) => {
        if (chatID && data) {
          const filteredMsg = data.filter((msg) => msg.chatID == chatID);
          if (filteredMsg) {
            setchatArray(filteredMsg);
            setMsgLength(
              filteredMsg.map(() => ({ length: filteredMsg.length }))
            );
            setisHover(
              filteredMsg.map(() => ({
                isHover: false,
              }))
            );
          }
        }
      });
    }
  };
  const getUsers = (data) => {
    getAllUsers(data._id).then((res) => {
      if (res) {
        setusers(res);
      }
    });
  };
  useEffect(() => {
    handleSocket();
    const storageData = localStorage.getItem("userData");
    if (storageData) {
      const userDetails = JSON.parse(storageData);
      setuserData(userDetails);
      getUsers(userDetails);
    }
  }, []);
  const [chatID, setchatID] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formDatas.msg !== "") {
      socket.emit("message", {
        chatID: chatID,
        sender: userData._id,
        receiver: currentChatPg?.receiver,
        message: formDatas.msg,
      });
      setformDatas({
        msg: "",
        userName: "",
      });
      handleSocket();
    }
  };
  const handleIsHoverOpen = (index) => {
    if (isHover) {
      let updatedArr = [...isHover];
      updatedArr[index].isHover = true;
      setisHover(updatedArr);
    }
  };
  const handleDeleteMsg = (id, index) => {
    deleteMessage(id).then((data) => {
      if (data.status == "ok" && chatID) {
        handleClose(index);
        fetchMsgs(chatID);
      }
    });
  };
  const handleIsHoverClose = (index) => {
    if (isHover) {
      let updatedArr = [...isHover];
      updatedArr[index].isHover = false;
      setisHover(updatedArr);
    }
  };
  const fetchMsgs = (chatID) => {
    getAllMessages(chatID).then((msg) => {
      if (msg) {
        setchatArray(msg);
        setMsgLength(msg.map(() => ({ length: msg.length })));
        setisHover(
          msg.map(() => ({
            isHover: false,
          }))
        );
      }
    });
  };
  const addChat = (data) => {
    if (data.sender && data.receiver) {
      const receiver = activeUsers.find((i) => i.id == data.receiver);
      if (receiver?.status == "online" || receiver !== undefined) {
        setisActive(true);
      } else {
        setisActive(false);
      }
      createChat(data);
      setcurrentChatPg(data);
      handleSocket();
      getAllChats(data.sender, data.receiver).then((chat) => {
        if (chat) {
          setchatID(chat._id);
          fetchMsgs(chat._id);
        }
      });
    }
  };
  const getUserNameByID = (id) => {
    const res = users.find((user) => user._id === id);
    if (res) {
      return res?.name;
    } else {
      return "Name";
    }
  };
  const getISTtime = (timestamp) => {
    const date = new Date(timestamp);
    date.setHours(date.getHours());
    date.setMinutes(date.getMinutes());
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Convert hours to 12-hour format
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // If hours is 0, convert it to 12 in 12-hour format

    // Format minutes and seconds to have leading zeros if less than 10
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    // Construct the final time string
    const timeIST12Hrs = `${hours12}:${formattedMinutes} ${period}`;
    return timeIST12Hrs;
  };
  const props = {
    chatArray,
    userData,
    handleIsHoverOpen,
    handleIsHoverClose,
    handleClose,
    isDarkMode,
    getISTtime,
    open,
    handleDeleteMsg,
    handleClick,
    isHover,
    menuIndex,
    anchorEl,
  };
  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: "30%",
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          background: isDarkMode ? "#111b21" : "white",
        }}
      >
        <Box
          sx={{
            background: isDarkMode ? "#202c33" : "#f1efed",
            width: "100%",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            height: "59px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar />
            <Typography
              sx={{ color: isDarkMode ? "white" : "black", fontWeight: "bold" }}
            >
              {userData?.name}
            </Typography>
          </Box>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            Logout
          </button>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: 49,
          }}
        >
          <Box
            sx={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <OutlinedInput
              size="small"
              fullWidth
              placeholder="Search or start a new chat"
              sx={{
                background: isDarkMode ? "#2a3942" : "",
                color: isDarkMode ? "white" : "black",
              }}
            />
          </Box>
        </Box>
        <Stack
          sx={{
            width: "100%",
            // overflow: "hidden",
            // "&:hover": {
            //   overflowY: "auto", // Show overflow when hovering over the side menu
            // },
            // overflowY: "scroll", // Show overflow when hovering over the side menu
            // height: "100%",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f5f5f5",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#bdbdbd",
              borderRadius: "4px",
              "&:hover": {
                background: "#a5a5a5",
              },
            },
          }}
        >
          {users?.map((elem, index) => {
            return (
              <Box
                key={index}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  flexDirection: "column",
                  height: "72px",
                }}
              >
                <Box
                  onClick={() => {
                    addChat({ sender: userData._id, receiver: elem._id });
                  }}
                  key={index}
                  sx={{
                    width: "100%",
                    padding: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 2,
                  }}
                >
                  <Avatar sx={{ width: 49, height: 49 }} />
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Stack>
                      {" "}
                      <Typography
                        sx={{
                          color: isDarkMode ? "white" : "black",
                          fontWeight: "bold",
                        }}
                      >
                        {elem.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: isDarkMode ? "#ffffff99" : "slategray",

                          fontSize: "small",
                        }}
                      >
                        Msg
                      </Typography>
                    </Stack>
                    <Chip
                      color="success"
                      label={MsgLength[index]?.length}
                      size="small"
                    />
                  </Box>
                </Box>
                <Divider sx={{ width: "80%", marginRight: 2 }} />
              </Box>
            );
          })}
        </Stack>
      </Box>
      <Stack
        sx={{
          height: "100%",
          width: "70%",
          display: "flex",
          flexDirection: "column",
          background: isDarkMode ? "#0b141a" : "#e4ddd9",
        }}
      >
        <Box
          sx={{
            background: isDarkMode ? "#202c33" : "#f1efed",
            width: "100%",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            gap: 2,
            height: "59px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Avatar />
            <Stack>
              <Typography
                sx={{
                  color: isDarkMode ? "white" : "black",
                  fontWeight: "bold",
                }}
              >
                {getUserNameByID(currentChatPg?.receiver)}
              </Typography>
              <Typography
                sx={{
                  color: isActive ? "green" : "slategray",
                  fontWeight: "bold",
                  fontSize: "small",
                }}
              >
                {isActive ? "Online" : "Offline"}
              </Typography>
            </Stack>
          </Box>
          <IconButton
            onClick={() => {
              setisDarkMode(!isDarkMode);
            }}
          >
            {!isDarkMode ? (
              <DarkMode sx={{ color: isDarkMode ? "white" : "black" }} />
            ) : (
              <LightMode sx={{ color: isDarkMode ? "white" : "black" }} />
            )}
          </IconButton>
        </Box>

        <div
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <ChatContainer props={props} />
        </div>

        <Box
          sx={{
            background: isDarkMode ? "#202c33" : "#f1efed",
            width: "100%",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 63,
          }}
        >
          <form style={{ width: "80%" }} onSubmit={handleSubmit}>
            <OutlinedInput
              size="small"
              placeholder="Message"
              fullWidth
              type="text"
              value={formDatas.msg}
              name="msg"
              onChange={handleOnchange}
              sx={{
                "&:hover .MuiInputBase-root": {
                  border: "initial !important",
                },
                background: isDarkMode ? "#2a3942" : "",
                color: isDarkMode ? "white" : "black",
              }}
            />
          </form>
        </Box>
      </Stack>
    </div>
  );
}
