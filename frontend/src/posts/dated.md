---
title: Date Labels
date: 2025-10-14T14:32:00
---

Added more appropriate date labelling to my reading graphs, makes a lot more sense to read days and dates than hourly timestamps when looking at a dataset that spans days or weeks.

I will need to implement some kind of stray value validation however. I've had two 0 value POSTs that were submitted to the database which have zoomed the graph way out. Just need to decide where to add it in. 

Having it on the ESP32 side seems the best instinctively, that would allow me to take an immediate second reading if it  provides a null/invalid reading and POST that instead.

I've come to the realisation that it isn't web development I don't like, just using JavaScript as a backend language.

<br>
<div className = "spotifyEmbed">
<iframe 
style="border-radius:12px" 
src="https://open.spotify.com/embed/track/5mexbTuWx9d8DPZk4sDGF4?utm_source=generator" 
height="152" 
frameBorder="0" 
allowfullscreen="" 
allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
loading="lazy">
</iframe>
</div>