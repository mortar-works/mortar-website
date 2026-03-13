---
title: "Contact"
layout: layouts/contact.njk
---

<form id="contactForm" action="https://formspree.io/f/mnnqqnev" method="POST">
  <div class="cf-field">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" placeholder="Your name" required>
  </div>
  <div class="cf-field">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" placeholder="your@email.com" required>
  </div>
  <div class="cf-field">
    <label for="reason">Reason for getting in touch</label>
    <select id="reason" name="reason">
      <option value="General Enquiry">General Enquiry</option>
      <option value="Demo">Demo of an existing tool or product</option>
      <option value="Service Design Support">Service Design Support</option>
      <option value="Technical Consultancy">Technical Consultancy</option>
      <option value="Product Development">Product Development</option>
      <option value="Data Solutions">Data and Intelligence Solutions</option>
      <option value="None">None of the above</option>
    </select>
  </div>
  <div class="cf-field">
    <label for="message">Message</label>
    <textarea id="message" name="message" placeholder="Tell us what you're working on..." required></textarea>
  </div>
  <button type="submit" class="cf-submit">Send message</button>
  <div id="contact-preloader" class="hidden">
    <div class="spinner"></div>
  </div>
</form>
