import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="UTF-8" />
                <meta name="description" content="Aashman Saini — AI/ML Engineer based in New Delhi. NLP chatbots, production ML systems, triple AWS certified. Open to AI/ML Engineering and Data Science roles." />
                <meta name="keywords" content="Aashman Saini, AI Engineer, ML Engineer, Machine Learning, NLP, AWS, Deep Learning, Portfolio, Delhi" />
                <meta name="author" content="Aashman Saini" />
                <meta name="robots" content="index, follow" />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Aashman Saini — AI & ML Engineer" />
                <meta property="og:description" content="AI/ML Engineer building machine learning systems that ship. NLP chatbots, prediction models, triple AWS certified." />
                <meta property="og:locale" content="en_IN" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Aashman Saini — AI & ML Engineer" />
                <meta name="twitter:description" content="AI/ML Engineer building machine learning systems that ship." />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />

                {/* Theme */}
                <meta name="theme-color" content="#070707" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
