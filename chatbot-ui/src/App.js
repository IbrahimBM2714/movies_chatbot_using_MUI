import {
  Box,
  TextField,
  Typography,
  Avatar,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState([
    { text: "How can I assit you today?", sender: "bot" },
  ]);

  const messageContainerRef = useRef(null);

  // This method is used to scroll the current page to the bottom when a new message has been added.
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      const container = messageContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const height = container.clientHeight;
      const maxScrollTop = scrollHeight - height;
      container.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [msg]);

  const fetchApi = async (newMessages) => {
    try {
      await axios
        // Get your own key from https://www.omdbapi.com
        .get(`https://www.omdbapi.com/?apikey=${"your api key"}&t=${input}`)
        .then((response) => {
          // The bot will only show the movie's plot
          console.log("api data: ", response.data.Plot);
          setMsg([
            ...newMessages,
            {
              text: response.data.Plot,
              sender: "bot",
            },
          ]);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = () => {
    if (input !== "") {
      const newMsg = { text: input, sender: "user" };
      const newMsgs = [...msg, newMsg];
      setMsg(newMsgs);
      console.log("messages: ", newMsgs);
      setInput("");
      fetchApi(newMsgs);
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "#f0f2f5" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="#7b809a"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: "#7b809a" }}
            >
              Chat
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          height: "89vh",
          display: "flex",
          boxSizing: "border-box",
          flexDirection: "column",
          bgcolor: "#f0f2f5",
          padding: "20px 70px 80px 70px",
          overflow: "auto",
        }}
        ref={messageContainerRef}
      >
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            bgcolor: "white",
            borderRadius: "25px",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
          }}
        >
          {msg.map((message, index) => (
            <Message
              key={index}
              message={message}
              sx={{
                p: 10,
              }}
            />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: "#f0f2f5",
          padding: "20px 70px",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              InputProps={{
                style: {
                  borderRadius: "25px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
                  margin: "0px",
                  backgroundColor: "white",
                  padding: "8px",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <SendOutlinedIcon
                      style={{
                        cursor: "pointer",
                        marginRight: "5px",
                        padding: "6px",
                        background:
                          "linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))",
                        borderRadius: "50%",
                        color: "white",
                        fontSize: "25px",
                      }}
                      onClick={handleSend}
                    />
                  </InputAdornment>
                ),
              }}
              size="small"
              fullWidth
              placeholder="Send a message"
              variant="outlined"
              value={input}
              onChange={handleInputChange}
              sx={{
                "&:hover": {
                  "& fieldset": {
                    borderWidth: 0,
                    borderColor: "transparent",
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

const Message = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isBot ? "row" : "row-reverse",
          alignItems: "center",
        }}
      >
        {isBot ? (
          <Avatar
            sx={{
              background:
                "linear-gradient(90deg, rgba(98,193,104,1) 47%, rgba(132,209,137,1) 100%)",
            }}
          >
            B
          </Avatar>
        ) : (
          <Avatar
            sx={{
              background:
                "linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))",
            }}
          >
            U
          </Avatar>
        )}

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            ml: isBot ? 1 : 0,
            mr: isBot ? 0 : 1,
            background: isBot
              ? "linear-gradient(90deg, rgba(98,193,104,1) 47%, rgba(132,209,137,1) 100%)"
              : "linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))",
            borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
          }}
        >
          <Typography variant="body1" sx={{ color: "white" }}>
            {message.text}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default App;
