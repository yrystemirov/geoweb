//import { AppPropsWithLayout } from '@/types/page';

import { AppPropsWithLayout } from "../components/common/layouts/types";

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
}

export default App;