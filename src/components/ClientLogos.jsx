import React, { useRef } from 'react';

export default function ClientLogos() {
    const clients = [
        "OECS",
        "GIZ",
        "Discover Dominica Authority",
        "UN Women",
        "UNICEF",
        "Caribbean Development Bank",
        "Dominica Festivals",
        "SAGICOR"
    ];

    // Double the array to allow for seamless infinite looping
    const repeatedClients = [...clients, ...clients, ...clients];

    return (
        <section className="pb-12 md:pb-20 bg-deepGreen relative w-full overflow-hidden">
            <div className="w-full flex">
                <div className="animate-marquee flex whitespace-nowrap items-center w-max">
                    {repeatedClients.map((client, i) => (
                        <div key={i} className="flex items-center justify-center px-12 md:px-20 mx-4">
                            <span className="font-serif italic font-semibold text-2xl md:text-3xl lg:text-4xl tracking-tighter text-offWhite/50 hover:text-offWhite transition-colors duration-500 cursor-default">
                                {client}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
