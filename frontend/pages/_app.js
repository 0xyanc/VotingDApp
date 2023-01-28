import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { hardhat, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@/components/Layout/Layout';
import { ContractProvider } from '@/context/ContractContext';
import { WorkflowStatusProvider } from '@/context/WorkflowStatusContext';

const { chains, provider } = configureChains(
  [hardhat, goerli],
  [
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'Voting System App',
  chains
});
const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
})

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <ContractProvider>
            <WorkflowStatusProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </WorkflowStatusProvider>
          </ContractProvider>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
