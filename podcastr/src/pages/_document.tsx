import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
        <Html>
          <Head>
            <link rel="shortcut icon" href="images/favicon.png" type="image/x-icon" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet" />    
          </Head>

          <body>
            <Main /> {/* onde ta a aplicação em si */}
            <NextScript /> {/* scripts que o next precisa */}
          </body>
        </Html>            
    );
  }
} 