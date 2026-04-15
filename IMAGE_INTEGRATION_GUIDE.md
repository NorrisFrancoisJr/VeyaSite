To replace the current temporary Unsplash images with your actual cinematic assets in the VEYA flagship, follow these steps:

### 1. Place Your Images in the `assets/images` Folder
I have created an `images` directory in your project's `src/assets` folder:
`/Users/norrisfrancoisjr/Downloads/antigrav/veya/src/assets/images`

Drop your high-resolution images (preferably optimized WebP or JPEG format) into this folder. For example, you might name them:
- `hero-bg.jpg`
- `secret-bay.jpg`
- `discover-dominica.jpg`
- `cabrits-resort.jpg`
- `why-veya-coastline.jpg`

### 2. Update `App.jsx` to Use Your Local Images
In React (using Vite), the best practice is to import your images at the top of the file so Vite can optimize and bundle them correctly. 

Open `/Users/norrisfrancoisjr/Downloads/antigrav/veya/src/App.jsx` and add imports at the top:
```javascript
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
// ... other imports

// Import your actual images here:
import heroBgImg from './assets/images/hero-bg.jpg';
import secretBayImg from './assets/images/secret-bay.jpg';
import discoverDominicaImg from './assets/images/discover-dominica.jpg';
import cabritsResortImg from './assets/images/cabrits-resort.jpg';
import whyVeyaImg from './assets/images/why-veya-coastline.jpg';
```

### 3. Swap the Image Sources in the Components
Once imported, replace the hard-coded Unsplash URLs with the imported variables.

**For the Hero Section:**
```javascript
// Change this:
<img 
  src="https://images.unsplash.com/..." 
  alt="Cinematic Caribbean coastline..." 
  className="hero-img w-full h-full object-cover origin-center"
/>

// To this:
<img 
  src={heroBgImg} 
  alt="Cinematic Caribbean coastline..." 
  className="hero-img w-full h-full object-cover origin-center"
/>
```

**For the Selected Work Section:**
Update the `projects` array to use your imported variables instead of string URLs:
```javascript
const projects = [
  {
    client: "Secret Bay Resort",
    title: "Defining Eco-Luxury in the Caribbean",
    tags: ["Film", "Photography", "Brand Strategy"],
    img: secretBayImg, // Use the variable here
    // ...
  },
  {
    client: "Discover Dominica",
    // ...
    img: discoverDominicaImg, 
  },
  // ...
```

**For the Why VEYA Section:**
```javascript
// Change this:
<img 
  src="https://images.unsplash.com/..." 
  alt="Cinematic coastal view" 
  className="w-full h-full object-cover img-zoom" 
/>

// To this:
<img 
  src={whyVeyaImg} 
  alt="Why Veya coastal view" 
  className="w-full h-full object-cover img-zoom" 
/>
```

### Next Steps
If you'd like, you can drop your images into that `src/assets/images` folder right now, tell me their exact filenames, and **I can update the code for you automatically.**
