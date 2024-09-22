import { Box, CircularProgress } from "@mui/material"

export const Loader = () => (
  <Box
    display="flex"
    justifyContent="center"
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "100%",
      height: "100%",
      zIndex: 1,
      background: "rgba(255, 255, 255, 0.2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress />
  </Box>
)
