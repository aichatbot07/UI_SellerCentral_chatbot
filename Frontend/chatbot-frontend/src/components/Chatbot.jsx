import React, { useState } from "react";
import { Fab, Modal, Box, Typography, TextField, Button } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSendMessage = () => {
    if (userInput.trim() !== "") {
      setMessages([...messages, { sender: "user", text: userInput }]);
      setUserInput("");
      
      // Simulate chatbot response (replace with API call)
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: "Processing your request..." }]);
      }, 1000);
    }
  };

  return (
    <>
      <Fab color="primary" onClick={() => setOpen(true)} sx={{ position: "fixed", bottom: 20, right: 20 }}>
        <ChatBubbleIcon />
      </Fab>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 400, bgcolor: "white", p: 2, m: "auto", mt: 5, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold">Chatbot</Typography>
          <Box sx={{ height: 300, overflowY: "auto", p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
            {messages.map((msg, index) => (
              <Typography key={index} align={msg.sender === "user" ? "right" : "left"}>
                <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
              </Typography>
            ))}
          </Box>
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSendMessage}>
            Send
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Chatbot;
