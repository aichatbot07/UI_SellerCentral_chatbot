import React, { useState } from "react";
import { Fab, Modal, Box, Typography, TextField, Button } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import axios from "axios"; // Import axios for making API calls

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSendMessage = async () => {
    if (userInput.trim() !== "") {
      const newMessages = [
        ...messages,
        { sender: "user", text: userInput.trim() }, // Trim input
        { sender: "bot", text: "Processing your request..." },
      ];
      setMessages(newMessages);
      setUserInput(""); // Clear input field

      setLoading(true); // Set loading state to true

      try {
        const response = await axios.post("http://localhost:8000/chat", {
          question: userInput.trim(),
        });

        setMessages([
          ...newMessages,
          { sender: "bot", text: response.data.response },
        ]);
      } catch (error) {
        setMessages([
          ...newMessages,
          { sender: "bot", text: "Sorry, I couldn't process your request." },
        ]);
      } finally {
        setLoading(false); // Reset loading state
      }
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
            {loading && <Typography align="center">Bot is typing...</Typography>} {/* Loading indicator */}
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
