---
title: "Contact"
layout: layouts/page.njk
---

We would love to hear from you. Whether you want to learn more about our products, discuss a project, or just explore what is possible — get in touch and we will get back to you as soon as we can.

You can also reach us directly at **office@mortar.works**

<div class="contact-form-card" style="margin-top: 2em;">
  <form id="contactForm" action="https://formspree.io/f/mnnqqnev" method="POST">
    <div>
      <label for="name">Name</label>
      <input type="text" id="name" name="name" required>
    </div>

    <div>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>
    </div>

    <div>
      <label for="reason">What is the reason for getting in touch?</label>
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

    <div>
      <label for="message">Message</label>
      <textarea id="message" name="message" required></textarea>
    </div>

    <button type="submit">Send Message</button>

    <div id="contact-preloader" class="hidden">
      <div class="spinner"></div>
    </div>
  </form>
</div>
