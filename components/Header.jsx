import React from 'react';

const Header = () => {
    return (
        <header className="bg-blue-500 text-white p-4">
            <h1>Header Component</h1>
            <nav>
                <ul className="flex space-x-4">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;


