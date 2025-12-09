import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "News Portal",
  description: "Next.js + Strapi News Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>

       
        
        <title>News HTML-5 Template </title>


        
            <link rel="stylesheet" href="assets/css/responsive.css"></link>
    
		<link rel="shortcut icon" type="image/x-icon" href="assets/img/favicon.ico"/>

        <link rel="stylesheet" href="assets/css/bootstrap.min.css"/>
            <link rel="stylesheet" href="assets/css/owl.carousel.min.css"/>
            <link rel="stylesheet" href="assets/css/ticker-style.css"/>
            <link rel="stylesheet" href="assets/css/flaticon.css"/>
            <link rel="stylesheet" href="assets/css/slicknav.css"/>
            <link rel="stylesheet" href="assets/css/animate.min.css"/>
            <link rel="stylesheet" href="assets/css/magnific-popup.css"/>
            <link rel="stylesheet" href="assets/css/fontawesome-all.min.css"/>
            <link rel="stylesheet" href="assets/css/themify-icons.css"/>
            <link rel="stylesheet" href="assets/css/slick.css"/>
            <link rel="stylesheet" href="assets/css/nice-select.css"/>
            <link rel="stylesheet" href="assets/css/style.css"/>


        
        {/* more css from template can also be added here */}
      </head>

      <body suppressHydrationWarning>

    
        <script src="./assets/js/vendor/modernizr-3.5.0.min.js"></script>
		
		<script src="./assets/js/vendor/jquery-1.12.4.min.js"></script>
        <script src="./assets/js/popper.min.js"></script>
        <script src="./assets/js/bootstrap.min.js"></script>
	   
        <script src="./assets/js/jquery.slicknav.min.js"></script>


        <script src="./assets/js/owl.carousel.min.js"></script>
        <script src="./assets/js/slick.min.js"></script>
    
        <script src="./assets/js/gijgo.min.js"></script>
		
        <script src="./assets/js/wow.min.js"></script>
		<script src="./assets/js/animated.headline.js"></script>
        <script src="./assets/js/jquery.magnific-popup.js"></script>

      
        <script src="./assets/js/jquery.ticker.js"></script>
        <script src="./assets/js/site.js"></script>


        <script src="./assets/js/jquery.scrollUp.min.js"></script>
        <script src="./assets/js/jquery.nice-select.min.js"></script>
		<script src="./assets/js/jquery.sticky.js"></script>
        
        
        <script src="./assets/js/contact.js"></script>
        <script src="./assets/js/jquery.form.js"></script>
        <script src="./assets/js/jquery.validate.min.js"></script>
        <script src="./assets/js/mail-script.js"></script>
        <script src="./assets/js/jquery.ajaxchimp.min.js"></script>
        
	
        <script src="./assets/js/plugins.js"></script>
        <script src="./assets/js/main.js"></script>


        	

      

		
    
         <Header />      {/* appears on every page automatically */}
        
        <main className="min-h-screen">
          {children}   {/* content of the page.tsx or route page renders here */}
        </main>

        <Footer /> 
      </body>
    </html>
  );
}
