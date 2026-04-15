import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    const location = useLocation();
    
    // Add "home" class to body if we're on the root path
    useEffect(() => {
        if (location.pathname === '/') {
            document.body.classList.add('home');
        } else {
            document.body.classList.remove('home');
        }
    }, [location]);

    return (
        <div id="main-layout" className="site-wrapper">
            <Navbar />
            <main id="main" className="site-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
