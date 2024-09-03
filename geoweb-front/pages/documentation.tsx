import { NextPageWithLayout } from "../components/common/layouts/types";
import LandingLayout from "../components/common/layouts/Landing.layout";
import { Box } from "@mui/material";
//import styles from "./src/page.module.css";



//import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Documentation: NextPageWithLayout = () => {
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

Documentation.getLayout = (page: any) => {
    return <LandingLayout>{page}</LandingLayout>;
};

export default Documentation;

// export const getStaticProps = async ({ locale = process.env.DEFAULT_LOCALE || 'ru' }) => ({
//     props: {
//         ...(await serverSideTranslations(locale, ['common', 'gis'])),
//     },
// });
