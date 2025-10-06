---
title: 
date: 2025-10-05T08:00:00
---

In lack of a live, viewable demo, I thought I'd give a walkthrough of my design and development process of the mobility aid.

Designed as my final project for my MSc, the mobility aid proposes a low cost solution to urban navigation for visually impaired users.
I wanted to create something with a hardware focus, due to both limited coverage on the course and because of my interest in the area from my experience with building and repairing computers.

This project was my first real exposure to C. Although having done the CS50 online classes, I've found C is a language that really starts to show it's prowess once you start developing a project when compared to coding challenges and exercises. 
I had considered using Rust or C++ but after taking a look at the syntax and my 3 month timespan, I decided against for the sake of development speed. Rust does still call to me as a language I'd like to explore though.

A similar decision was made regarding the hardware to use, the Raspberry Pi, for the same reasons as above, seemed the obvious choice for someone with my experience level. In hindsight, now owning both an ESP32 and an STM32, I made the right decision. 
I'm not sure how I would've implemented the machine learning component of this project without the extra processing power of the Pi. Having access to Linux also allowed me to write code to the Pi over SSH and alongside all the other advantages that using a standard OS gives when compared to a simple super loop or RTOS.

If you are reading this it means I've managed to deploy this on EC2 properly.
  
<br>
<div className = "spotifyEmbed">
<iframe 
style="border-radius:12px" 
src="https://open.spotify.com/embed/track/3pBATRtqFpskM7f0jdSIAG?utm_source=generator" 
height="152" 
frameBorder="0" 
allowfullscreen="" 
allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
loading="lazy">
</iframe>
</div>
