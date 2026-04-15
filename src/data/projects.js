export const projects = [
    { 
        id: 'turtle-beach-villa', 
        name: "Turtle Beach Villa", 
        category: "Creative, Production", 
        tags: ["branding", "content", "production"],
        image: "/turtle-beach-villa/optimized/DJI_20251126070059_0026_D.jpg", 
        clientDetails: [
            { label: "Services", value: "Creative, Production" },
            { label: "Location", value: "Caribbean" }
        ],
        blocks: [
            {
                type: "VeyaSliderMedia",
                pattern: "1-1",
                media: ["/turtle-beach-villa/optimized/DSC08384.jpg"]
            },
            {
                type: "VeyaSectionText",
                layout: "centered",
                topLabel: "01 — The Architecture",
                title: "Cinematic Coastal Expression",
                body: "Located on a remote edge of the coastline, Turtle Beach Villa was originally designed to harmonize with the ocean's tide schedule. We documented this property by capturing natural shadows cascading across pure minimalist angles."
            },
            {
                type: "VeyaGalleryMedia",
                pattern: "1-2",
                images: [
                    "/turtle-beach-villa/optimized/DSC08429.jpg",
                    "/turtle-beach-villa/optimized/DSC08607.jpg",
                    "/turtle-beach-villa/optimized/DSC08631.jpg"
                ]
            },
            {
                type: "VeyaSectionText",
                layout: "centered",
                topLabel: "02 — The Vibe",
                title: "Slowing Down the Clock",
                body: "Through slow, measured cinematic sweeps, and bright, sun-kissed grading techniques, we presented the Villa not simply as a structure, but as an experience woven directly into the fabric of the island."
            },
            {
                type: "VeyaGalleryMedia",
                pattern: "2-2",
                images: [
                    "/turtle-beach-villa/optimized/DSC08682.jpg",
                    "/turtle-beach-villa/optimized/DSC08924.jpg",
                    "/turtle-beach-villa/optimized/DSC08929.jpg",
                    "/turtle-beach-villa/optimized/DJI_20251126070059_0026_D.jpg"
                ]
            },
            {
                type: "VeyaGalleryMedia",
                pattern: "1-1",
                videos: ["/turtle-beach-villa/optimized/turtle-hero.mp4"]
            }
        ]
    },
    { 
        id: '1', 
        name: "Cabrits Resort & Spa", 
        category: "Photography, Web Design", 
        tags: ["content", "web"],
        image: "/turtle-beach-villa/optimized/DSC08924.jpg" 
    },
    { 
        id: '2', 
        name: "Secret Bay Eco-Villas", 
        category: "Film, Brand Strategy", 
        tags: ["content", "branding"],
        image: "/turtle-beach-villa/optimized/DSC08682.jpg" 
    },
    { 
        id: '3', 
        name: "Discover Dominica", 
        category: "Campaign, Production", 
        tags: ["performance", "content"],
        image: "/turtle-beach-villa/optimized/DSC08429.jpg" 
    },
    { 
        id: '4', 
        name: "Fort Young Hotel", 
        category: "Branding, Content", 
        tags: ["branding", "content"],
        image: "/turtle-beach-villa/optimized/DSC08631.jpg" 
    },
    { 
        id: '5', 
        name: "Coulibri Ridge", 
        category: "Social, Strategy", 
        tags: ["social", "branding"],
        image: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=1600&auto=format&fit=crop" 
    },
    { 
        id: '6', 
        name: "Jungle Bay", 
        category: "Performance, Web Design", 
        tags: ["performance", "web"],
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1600&auto=format&fit=crop" 
    }
];
