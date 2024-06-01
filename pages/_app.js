import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, chain, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { sepolia } from "wagmi/chains";
import { RainbowKitProvider, getDefaultWallets, darkTheme } from "@rainbow-me/rainbowkit";
import NavBar from "@/components/NavBar";


const { chains, provider } = configureChains(
  [sepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "gwg",
  chains,
});

const wagmiClinet = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClinet}>
      <RainbowKitProvider chains={chains} theme={darkTheme({
        accentColor: '#ffffff',
        accentColorForeground: 'black',
        borderRadius: 'medium',
        borderRadius: 'none',
      })}>
        <NavBar>
        </NavBar>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
