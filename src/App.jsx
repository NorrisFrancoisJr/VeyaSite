import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Studio from './pages/Studio';
import Work from './pages/Work';
import SmoothScroll from './components/SmoothScroll';
import ProjectDetail from './pages/ProjectDetail';
import ServiceCategory from './pages/ServiceCategory';
import ProposalTemplate from './pages/ProposalTemplate';
import InvoiceTemplate from './pages/InvoiceTemplate';
import ProposalBuilder from './pages/ProposalBuilder';

export default function App() {
    return (
        <Routes>
            <Route path="/proposal-builder" element={<ProposalBuilder />} />
            <Route path="/proposal-template" element={<ProposalTemplate />} />
            <Route path="/invoice-template" element={<InvoiceTemplate />} />
            <Route path="/" element={<SmoothScroll><Layout /></SmoothScroll>}>
                <Route index element={<Home />} />
                <Route path="work/:id" element={<ProjectDetail />} />
                <Route path="studio" element={<Studio />} />
                <Route path="work" element={<Work />} />
                <Route path=":slug" element={<ServiceCategory />} />
            </Route>
        </Routes>
    );
}
