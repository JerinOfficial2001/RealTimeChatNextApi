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
  const JersAppThemes = {
    whatsappDark: {
      userContainer: "#111b21",
      header: "#202c33",
      text: "white",
      inputBg: "#2a3942",
      subText: "#ffffff99",
      chatContainer: "#0b141a",
    },
    whatsappLight: {
      userContainer: "white",
      header: "#f1efed",
      text: "black",
      inputBg: "",
      subText: "slategray",
      chatContainer: "#e4ddd9",
    },
    JersApp: {
      // userContainer: "#D9D9D9",
      header: "#0E0E0E4A",
      text: "white",
      inputBg: "",
      subText: "slategray",
      chatContainer:
        "linear-gradient(125.42deg, rgba(9, 9, 9, 0.23) 8.37%, rgba(176, 176, 176, 0.2) 90.72%)",
    },
  };
  const [themeHandler, setthemeHandler] = useState("JersApp");
  const [JersAppTheme, setJersAppTheme] = useState(JersAppThemes[themeHandler]);
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
          background: JersAppTheme.userContainer,
        }}
      >
        <Box
          sx={{
            background: JersAppTheme.header,
            width: "100%",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            height: "85px",
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
            <Typography sx={{ color: JersAppTheme.text, fontWeight: "bold" }}>
              {userData?.name}
            </Typography>
          </Box>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
            style={{ color: JersAppTheme.text }}
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
                background: JersAppTheme.inputBg,
                color: JersAppTheme.text,
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
                          color: JersAppTheme.text,
                          fontWeight: "bold",
                        }}
                      >
                        {elem.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: JersAppTheme.subText,

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
                <Divider
                  sx={{ width: "80%", marginRight: 2, borderColor: "#4C4646" }}
                />
              </Box>
            );
          })}
        </Stack>
      </Box>
      <Box
        sx={{
          width: "70%",
          display: "flex",
          alignItems: "center",
          height: "99%",
          flexDirection: "column",
        }}
      >
        <Stack
          sx={{
            height: "100%",
            width: "98%",
            display: "flex",
            flexDirection: "column",
            backgroundImage: JersAppTheme.chatContainer,
            marginTop: 2,
            borderRadius: "30px",
          }}
        >
          <Box
            sx={{
              background: JersAppTheme.header,
              width: "100%",
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              gap: 2,
              height: "59px",
              borderTopLeftRadius: "30px",
              borderTopRightRadius: "30px",
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
                    color: JersAppTheme.text,
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
                <DarkMode sx={{ color: JersAppTheme.text }} />
              ) : (
                <LightMode sx={{ color: JersAppTheme.text }} />
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
              background: JersAppTheme.header,
              width: "100%",
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 63,
              borderBottomLeftRadius: "30px",
              borderBottomRightRadius: "30px",
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
                  background: JersAppTheme.inputBg,
                  color: JersAppTheme.text,
                }}
              />
            </form>
          </Box>
        </Stack>
      </Box>
    </div>
  );
}
