import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Icon } from "@mui/icons-material"; // Ensure correct import

const CategoryCard = ({ title, icon: IconComponent }) => {
  return (
    <Card
      sx={{
        width: 250,
        height: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
      }}
    >
      {IconComponent && <IconComponent sx={{ fontSize: 50, color: "primary.main" }} />}
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
