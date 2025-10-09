---
title: Beautiful Padlock
date: 2025-10-09T15:00:00
---

We've got HTTPS support. Thanks to the GitHub student pack, I've gotten an SSL certificate for a year for free, although I'm pretty sure you can get them for free anyway so...

Surprisingly, setting up the ESP32 POST request over HTTPS was the easy part, just requiring the .pem to be embedded into the HTTP client config. The majority of the work was updating DNS records and the Nginx configuration. 

Also took the opportunity to move both the Nginx config and Docker Compose file to the root of the repo, rather than having to cd into the backend directory to compose the containers, which also required setup and config changes. 

But, as a result theres now a beautiful padlock symbol instead of a nasty "Not Secure" warning.

<strong>Up Next -</strong> Collating the ESP's reading history into some nice looking graphs. Requiring more endpoints and SQL practice. 

<br>
<div className = "spotifyEmbed">
<iframe 
style="border-radius:12px" 
src="https://open.spotify.com/embed/track/29JLgNBcOky7QB68OrvYxO?utm_source=generator" 
height="152" 
frameBorder="0" 
allowfullscreen="" 
allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
loading="lazy">
</iframe>
</div>