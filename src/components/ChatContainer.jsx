import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Grid, Menu, MenuItem, Stack } from "@mui/material";
import React from "react";

export default function ChatContainer({ props }) {
  const {
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
  } = props;
  return (
    <Grid
      container
      sx={{
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
        height: "550px",
        overflowY: "scroll",
        width: "100%",
        padding: "0 30px",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
      }}
    >
      {chatArray.map((chat, index) => {
        const isCurrentUser = chat.receiver !== userData._id;

        return (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            key={index}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: isCurrentUser ? "flex-end" : "flex-start",
              alignItems: "center",
              padding: 3,
              gap: 3,
            }}
          >
            <Box
              onMouseEnter={() => {
                handleIsHoverOpen(index);
              }}
              onMouseLeave={() => {
                handleIsHoverClose(index);
                handleClose(index);
              }}
              sx={{
                borderRadius: isCurrentUser
                  ? "10px 10px 0 10px"
                  : "0 10px 10px 10px",
                color: isDarkMode ? "white" : "black",

                background: isDarkMode
                  ? isCurrentUser
                    ? "#005c4b"
                    : "#202c33"
                  : isCurrentUser
                  ? "#dcf8c6"
                  : "white",
                padding: 1,
                display: "flex",
                gap: 2,
                flexDirection: "row",
              }}
            >
              <p>{chat.message}</p>
              <Stack
                sx={{
                  position: "relative",
                  minWidth: "50px",
                  minHeight: "33px",
                  alignItems: "flex-end",
                  justifyItems: "flex-start",
                }}
              >
                <p
                  style={{
                    color: isDarkMode ? "#ffffff99" : "slategray",
                    fontSize: "11px",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    flexWrap: "nowrap",
                  }}
                >
                  {getISTtime(chat.createdAt)}
                </p>
                {isHover[index]?.isHover && (
                  <div
                    ariaaria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={(event) => {
                      handleClick(event, index);
                    }}
                  >
                    <KeyboardArrowDownIcon
                      fontSize="small"
                      sx={{
                        color: isDarkMode ? "#ffffff99" : "slategray",
                      }}
                    />
                  </div>
                )}
                <Menu
                  id="basic-menu"
                  open={open && menuIndex == index}
                  anchorEl={anchorEl}
                  onClose={() => {
                    handleClose(index);
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleDeleteMsg(chat._id, index);
                    }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </Stack>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}
