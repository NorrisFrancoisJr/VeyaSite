import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Studio from './pages/Studio';
import Work from './pages/Work';
import SmoothScroll from './components/SmoothScroll';
import ProjectDetail from './pages/ProjectDetail';
import ServiceCategory from './pages/ServiceCategory';

export default function App() {
    return (
        <SmoothScroll>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="work/:id" element={<ProjectDetail />} />
                    <Route path="studio" element={<Studio />} />
                    <Route path="work" element={<Work />} />
                    <Route path=":slug" element={<ServiceCategory />} />
                </Route>
            </Routes>
        </SmoothScroll>
    );
}
