import { Pacifico, Lilita_One } from "next/font/google";
import './styles/global.scss';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Providers from "./_components/Providers";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-logo', 
});


const lilita_one = Lilita_One({
  weight:'400',
  subsets: ['latin'],
  variable: '--font-general',
});

const queryClient=new  QueryClient();

export default function RootLayout({ children }) {
  return (
  
    <html lang="en" className={`${pacifico.variable} ${lilita_one.variable}`}>
      <body>
      <Providers>
        {children}
      </Providers>
      </body>
    </html>
    
  );
}
