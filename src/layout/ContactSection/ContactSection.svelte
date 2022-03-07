<script lang="ts">
    import { links } from "$data/links";
    import { externalLink, HeaderChip, PageSection } from "$lib";

    let scrollY: number;
</script>

<svelte:window on:scroll={() => window.requestAnimationFrame(() => scrollY = window.scrollY )} />

    <PageSection id="contact-section">
        <HeaderChip>Contact</HeaderChip>
        <h2>Keep this project alive</h2>
        <p>
            We are helping others with the help of our donors. Donate today.
        </p>

        <div class="contact-section">
            <form id="fs-frm" class="contact" name="department-contact-form" accept-charset="utf-8" action="https://formspree.io/f/mrgjpojw" method="post">
                <label class="label" for="full-name">Full Name</label>
                <input class="input" type="text" name="name" id="full-name" placeholder="First and Last" required>
                <label class="label" for="email-address">Email Address</label>
                <input class="input" type="email" name="_replyto" id="email-address" placeholder="email@gmail.com" required>
                <label class="label" for="message">Message</label>
                <textarea class="textarea" rows="5" name="message" id="message" placeholder="Message." required></textarea>
                <input type="hidden" name="_subject" id="email-subject" value="Contact Form Submission">
                <input class="button" type="submit" value="Send Message">
            </form>
        </div>
    </PageSection>

<style lang="scss">
    @use "ContactSection";
</style>
