import { Box } from "@mui/material";
import React from "react";
//import styles from "./src/page.module.css";



//import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Documentation:  React.FC = () => {
    return <>
           <Box
              width="100%"
              display="flex"
              justifyContent="center"
              alignItems="top"
              flexDirection="row"
              flex={1}
              position="relative"
              p={0}
            >
              <p>Mina jerde Documentation degen aqparat bolui kerek</p>
          </Box>
    </>;
};

export default Documentation;