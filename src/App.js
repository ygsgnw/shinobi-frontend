import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Watch from './pages/Watch';

function App() {
	return (
		<div>
			<Router>
				<Navbar />
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/search' element={<Search />} />
					<Route path='/watch/:anilistId' element={<Watch />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;