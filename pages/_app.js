import { Inter } from 'next/font/google';
import '../styles/global.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export default function App({ Component, pageProps }) {
    return (
        <div className={inter.variable}>
            <Component {...pageProps} />
        </div>
    );
}