import React, { useState } from "react";
import { Fab, Modal, Box, Typography, TextField, Button } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import axios from "axios"; // Import axios for making API calls
import { useLocation } from "react-router-dom";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const location = useLocation();
  const isProductPage = location.pathname.startsWith("/product/"); // or whatever your route looks like
  const productId = isProductPage ? location.pathname.split("/product/")[1] : null;
  
  const handleSendMessage = async () => {
    if (userInput.trim() !== "") {
      const newMessages = [...messages, { sender: "user", text: userInput.trim() }];
      setMessages(newMessages);
      setUserInput("");
      setLoading(true);
  
      // 🤖 Context-aware prompt engineering
      let fullQuestion = userInput.trim();
  
      if (!productId) {
        // 🧠 Not on product page → inject seller context into the question
        fullQuestion = `The seller ID is seller123. ${userInput.trim()}`;
      }
  
      const payload = {
        question: fullQuestion,
      };
  
      // 🛍️ If on product page, include product ID as 'asin'
      if (productId) {
        payload.asin = productId;  // backend expects 'asin', not 'product_id'
      }
  
      try {
        const response = await axios.post(
          "https://fastapi-app-1061880689774.us-central1.run.app/chat",
          payload
        );
        
        
        
  
        setMessages([
          ...newMessages,
          { sender: "bot", text: response.data.answer },
        ]);
      } catch (error) {
        console.error(error);
        setMessages([
          ...newMessages,
          {
            sender: "bot",
            text: "Hmm... looks like my brain is offline. Try again in a bit.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };
  
  


  return (
    <>
      <Fab
        color="primary"
        onClick={() => {
          setOpen(true);
          if (messages.length === 0) {
            setMessages([{ sender: "bot", text: "Hi there! How can I help you today?" }]);
          }
        }}
        sx={{ position: "fixed", bottom: 20, right: 20 }}
      >
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
            {loading && <Typography align="left">Bot is typing...</Typography>}
          </Box>

          <TextField
            fullWidth
            placeholder="Type a message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            sx={{ mt: 2 }}
          />


          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSendMessage}>
            Send
          </Button>

          {/* 💥 Clear Chat Button */}
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{ mt: 1 }}
            onClick={() => setMessages([])}
          >
            Clear Chat
          </Button>
        </Box>
      </Modal>

    </>
  );
};

export default Chatbot;
