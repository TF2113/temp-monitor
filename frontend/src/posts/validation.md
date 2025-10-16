---
title: Keys & Validation
date: 2025-10-16T16:00:00
---

Successfully added reading validation on the ESP before a POST request is made, so there shouldn't be any more zeroed readings reaching my database. Just a simple while loop to allow for a few retries to prevent consecutive error readings. 

If it doesn't get valid readings after 3 tries it will just go back to deep sleep to try again later. 

Similarly, got the POST endpoint secured with an API key. So only the ESP32 should be allowed to make POST requests from now. Tightening up security, although being able to send misleading temperature details to the database wouldn't have exactly caused any real damage. 

Added to the POST request via the header and then read through environment variables on the Spring Boot end inside the docker-compose file. All nicely secured from public view through .gitignore, please don't take that as a challenge.

I'm quite happy with how this little project is sitting now, maybe time to start something new from my endless list of ideas...

<br>
<div className = "spotifyEmbed">
<iframe 
style="border-radius:12px" 
src="https://open.spotify.com/embed/track/4T0DoNFR4UAFGg0SaxVhtN?utm_source=generator"
height="152" 
frameBorder="0" 
allowfullscreen="" 
allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
loading="lazy">
</iframe>
</div>