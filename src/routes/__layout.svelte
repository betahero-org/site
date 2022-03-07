<script lang="ts">
  import { dev } from "$app/env";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  import { Footer, Navbar } from "$layout";
  import { links, NavbarItem } from "$data/links";
  import { docs } from "$data/docs";

  import "fluent-svelte/theme.css";

  import Chat from "@fluentui/svg-icons/icons/chat_24_regular.svg?raw";
  import Code from "@fluentui/svg-icons/icons/code_24_regular.svg?raw";
  import Home from "@fluentui/svg-icons/icons/home_24_regular.svg?raw";
  import Book from "@fluentui/svg-icons/icons/book_24_regular.svg?raw";
  import News from "@fluentui/svg-icons/icons/news_24_regular.svg?raw";
  import Heart from "@fluentui/svg-icons/icons/heart_24_regular.svg?raw";
  // import PaintBrush from "@fluentui/svg-icons/icons/paint_brush_24_regular.svg?raw";

  const { github, discord } = links;

  const navbarItems: NavbarItem[] = [
    {
      name: "Home",
      path: "/",
      icon: Home
    },
    {
      name: "Docs",
      path: "/docs",
      sidebarTree: docs,
      icon: Book
    },
    // {
    //     name: "Themes",
    //     path: "/themes",
    //     icon: PaintBrush
    // },
    {
      name: "Blog",
      path: "/blog",
      icon: News
    },
    {
        name: "Donate",
        path: "/donate",
        icon: Heart
    }
  ];

  const navbarButtons = [
    {
      label: "Discord",
      href: `https://discord.gg/${ discord }`,
      icon: Chat
    },
    {
      label: "GitHub",
      href: `https://github.com/${ github.repo }/${ github.siteRepo }`,
      icon: Code
    }
  ];

  let theme: "light" | "dark" = "light";

  onMount(() => {
    theme = window?.matchMedia("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
      theme = e.matches ? "dark" : "light";
    });
  });

</script>

<svelte:head>
  <meta content="BetaHero" name="og:site_name">

  <meta content="website" name="og:type">

  <link
    href="/branding/logo{$page.url.pathname.startsWith('/themes') ? '-themes' : ''}{'-' + (theme ?? 'light')}.svg"
    rel="icon"
    type="image/svg+xml"
  >

  <meta
    content="A non-profit dedicated inspiring influencers and web developers."
    name="description"
  >
  <meta
    content="A non-profit dedicated inspiring influencers and web developers."
    name="og:description"
  >
  <meta
    content="A non-profit dedicated inspiring influencers and web developers."
    name="twitter:description"
  >
  <meta
    content="Community Charity, nonprofit charity, non-profit, charity"
    name="keywords"
  >
  <meta content="Betahero Community" name="author">

  <meta content="#005fb8" name="theme-color">

  <meta content="summary_large_image" name="twitter:card">
  <meta content="@betahero_org" name="twitter:site">
  <meta content="@betahero_org" name="twitter:creator">

  {#if !dev && $page.url.host === "betahero.org"}
  <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-PPM1GH2RL5"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-PPM1GH2RL5');
    </script>
  {/if}
</svelte:head>

<Navbar buttons={navbarButtons} items={navbarItems} />
<slot />
<Footer />

<style global lang="scss">
  @use "src/styles/global";
  @use "src/styles/markdown";
</style>
