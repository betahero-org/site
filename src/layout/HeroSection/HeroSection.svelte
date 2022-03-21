<script lang="ts">
  import { externalLink, PageSection, TerminalCommand } from "$lib";
  import { Button, ContentDialog, MenuFlyout, MenuFlyoutItem } from "fluent-svelte";
  import { links } from "$data/links";
  import { onMount } from "svelte";
  import ArrowDownload from "@fluentui/svg-icons/icons/arrow_download_24_regular.svg?raw";
  import Globe from "@fluentui/svg-icons/icons/globe_24_regular.svg?raw";
  import ChevronDown from "@fluentui/svg-icons/icons/chevron_down_24_regular.svg?raw";
  import HeartFill from "@fluentui/svg-icons/icons/heart_24_filled.svg?raw";

  type WaystoContribute = "Give a Donation" | "Volunteer Your Time" | "Become a Sponsor";
  const waystoContribute: toContribute[] = ["Give a Donation", "Volunteer Your Time", "Become a Sponsor"];

  // Check the user agent for a windows install
  let isWindows: boolean;

  let wingetDialogOpen = false;

  let isDownloadDropdownOpen = false;

  // Group bindings
  let currentWaystoContribute: WaystoContribute = "Give a Donation"

  const getStoreUrl = () => isWindows
    ? `ms-windows-store://pdp/?ProductId=${ links.storeId }&mode=mini`
     : `https://www.microsoft.com/en-us/p/files/${ links.storeId }`;
  $: sideloadLink = `/donate/`;
  $: downloadLink = currentWaystoContribute === "Microsoft Store" ? getStoreUrl() : sideloadLink;

  const changeWaystoContribute = (waystoContribute: WaystoContribute) => {
    currentWaystoContribute = waystoContribute;
    localStorage.setItem("waystoContribute", waystoContribute);

  };

</script>

<PageSection id="hero-section">
  <div class="hero-left">
    <h1>Heroes</h1>
    <h3>aren't born they are made. </h3>
    <p>We are a nonprofit designed to inspire, educate and mentor youth through technology for the heroes of tomorrow.</p>
    <div class="buttons-spacer">
      <div class="split-button">
        <Button
          id="hero-download-button"
          variant="accent"
          href={currentWaystoContribute !== "Give a Donation" ? downloadLink : undefined}
          on:click={() => {
            if (currentWaystoContribute === "Give a Donation") wingetDialogOpen = true;
          }}
          {...(currentWaystoContribute !== "Give a Donation" ? externalLink : undefined)}
        >
          {@html Globe}
          <div class="hero-button-inner">
            <h5>Get Involved</h5>
            <span>{waystoContribute.find(source => source === currentWaystoContribute)}</span>
          </div>
        </Button>
        <MenuFlyout bind:open={isDownloadDropdownOpen} placement="bottom">
          <Button
            aria-label="Choose way to get Involved"
            title="Choose way to get Involved"
            variant="accent"
          >
            {@html ChevronDown}
          </Button>
          <svelte:fragment slot="flyout">
            {#each waystoContribute as waystoContribute}
              <MenuFlyoutItem on:click={() => changeWaystoContribute(waystoContribute)}>
                {waystoContribute}
              </MenuFlyoutItem>
            {/each}
          </svelte:fragment>
        </MenuFlyout>
      </div>
      <Button
        href="https://github.com/sponsors/{links.github.repo}/"
        {...externalLink}
      >
        {@html HeartFill}
        <div class="hero-button-inner">
          <h5>Sponsor on GitHub</h5>
          <span>BetaHero is open source!</span>
        </div>
      </Button>
    </div>
  </div>
  <div class="hero-right">
    <div class="hero-image-container">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="/screenshots/hero-dark.png"
        >
        <source
          media="(prefers-color-scheme: light)"
          srcset="/screenshots/hero-light.png"
        >
        <img
          alt="BetaHero screenshot"
          height="768"
          src="/screenshots/hero-light.png"
          width="1024"
        >
      </picture>
    </div>
  </div>
  <div class="rainbow-background" slot="outer"></div>
</PageSection>

<ContentDialog
  bind:open={wingetDialogOpen}
  title="Installing Files via winget"
  size="max"
>
  To download and install Files using
  <a href="https://github.com/microsoft/winget-cli" class="hyperlink" {...externalLink}>winget</a>,
  paste the following command into a terminal of your choice:
  <TerminalCommand command="winget install -e 9NGHP3DX8HDX" />
  <svelte:fragment slot="footer">
    <Button on:click={() => (wingetDialogOpen = false)}>Close</Button>
  </svelte:fragment>
</ContentDialog>

<style lang="scss">
  @use "HeroSection";
</style>
