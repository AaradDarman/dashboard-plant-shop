import React from "react";

import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea, Skeleton } from "@mui/material";

const Wraper = styled.div`
  position: relative;
  z-index: 1;
  height: "270px";
`;

const SkeletonProductLoading = () => {
  return (
    <Wraper>
      <Card
        sx={{
          bgcolor: "secondary.light",
          backgroundImage: "none",
          position: "relative",
          borderRadius: "1rem",
          height: "100%",
        }}
      >
        <CardActionArea
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            height: "100%",
            padding: "2rem",
          }}
        >
          <div className="mb-auto flex justify-between">
            <div className="product-info flex w-2/3 flex-col">
              <Skeleton sx={{ flex: 0.5, width: 120 }} animation="wave" />
              <Skeleton sx={{ flex: 0.3, width: 70 }} animation="wave" />
              <Skeleton sx={{ flex: 0.3, width: 60 }} animation="wave" />
              <Skeleton sx={{ flex: 0.3, width: 70 }} animation="wave" />
            </div>
            <div className="img-wraper">
              <Skeleton
                sx={{ width: 70, height: 70 }}
                animation="wave"
                variant="rectangular"
              />
            </div>
          </div>
          <CardContent
            sx={{
              bgcolor: "secondary.light",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Skeleton sx={{ height: 32 }} animation="wave" />
          </CardContent>
        </CardActionArea>
      </Card>
    </Wraper>
  );
};

export default SkeletonProductLoading;
