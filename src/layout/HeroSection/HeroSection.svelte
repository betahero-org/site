<script lang="ts">
  import { externalLink, PageSection, TerminalCommand } from "$lib";
  import { Button, ContentDialog, MenuFlyout, MenuFlyoutItem } from "fluent-svelte";
  import { links } from "$data/links";
  import { onMount } from "svelte";
  import ArrowDownload from "@fluentui/svg-icons/icons/arrow_download_24_regular.svg?raw";
  import Globe from "@fluentui/svg-icons/icons/globe_24_regular.svg?raw";
  import ChevronDown from "@fluentui/svg-icons/icons/chevron_down_24_regular.svg?raw";
  import HeartFill from "@fluentui/svg-icons/icons/heart_24_filled.svg?raw";

  type WaystoContribute = "Donate" | "Volunteer" | "Sponsor";
  const waystoContribute: toContribute[] = ["Donate", "Volunteer", "Sponsor"];

  type DownloadSource = "Microsoft Store" | "Winget (CLI)" | "Sideload Package" | "Sideload Package (Preview)";
  const downloadSources: DownloadSource[] = ["Microsoft Store", "Winget (CLI)", "Sideload Package", "Sideload Package (Preview)"];

  // Check the user agent for a windows install
  let isWindows: boolean;

  let wingetDialogOpen = false;
  let wingetCommandCopied = false;

  let isDownloadDropdownOpen = false;

  let currentWaystoContribute: WaystoContribute = "Donate"

  // Group bindings
  // let currentDownloadSource: DownloadSource = "Microsoft Store";
  // const getStoreUrl = () => isWindows
  //   ? `ms-windows-store://pdp/?ProductId=${ links.storeId }&mode=mini`
  //   : `https://www.microsoft.com/en-us/p/files/${ links.storeId }`;
  // $: sideloadLink = `/download/${ currentDownloadSource !== "Sideload Package (Preview)" ? "stable" : "preview" }`;
  // $: downloadLink = currentDownloadSource === "Microsoft Store" ? getStoreUrl() : sideloadLink;

  // const copyWingetCommand = () => {
  //   navigator.clipboard.writeText("winget install -e 9NGHP3DX8HDX");
  //   wingetCommandCopied = true;
  //   setTimeout(() => {
  //     wingetCommandCopied = false;
  //   }, 500);
  // };

  const getStoreUrl = () => isWindows
    ? `ms-windows-store://pdp/?ProductId=${ links.storeId }&mode=mini`
     : `https://www.microsoft.com/en-us/p/files/${ links.storeId }`;
  $: sideloadLink = `/download/${ currentWaystoContribute !== "Sideload Package (Preview)" ? "stable" : "preview" }`;
  $: downloadLink = currentWaystoContribute === "Microsoft Store" ? getStoreUrl() : sideloadLink;
  const copyWingetCommand = () => {
    navigator.clipboard.writeText("winget install -e 9NGHP3DX8HDX");
    wingetCommandCopied = true;
    setTimeout(() => {
      wingetCommandCopied = false;
    }, 500);
  };

  const changeWaystoContribute = (waystoContribute: WaystoContribute) => {
    currentWaystoContribute = waystoContribute;
    localStorage.setItem("waystoContribute", waystoContribute);

    // if (waystoContribute !== "Winget (CLI)") {
    //   window.open(waystoContribute === "Microsoft Store" ? getStoreUrl() : sideloadLink, "_blank");
    // } else {
    //   wingetDialogOpen = true;
    // }

    // isDownloadDropdownOpen = false;
  };

  // const changeDownloadSource = (downloadSource: DownloadSource) => {
  //   currentDownloadSource = downloadSource;
  //   localStorage.setItem("downloadSource", downloadSource);

  //   if (downloadSource !== "Winget (CLI)") {
  //     window.open(downloadSource === "Microsoft Store" ? getStoreUrl() : sideloadLink, "_blank");
  //   } else {
  //     wingetDialogOpen = true;
  //   }

  //   isDownloadDropdownOpen = false;
  // };

  // onMount(async () => {
  //   // Get the user's download preference
  //   if (!localStorage.getItem("downloadSource")) {
  //     localStorage.setItem("downloadSource", "Microsoft Store");
  //   }
  //   currentDownloadSource = (localStorage.getItem("downloadSource") ?? "Microsoft Store") as DownloadSource;

  //   isWindows = navigator.userAgent.includes("Windows");
  // });

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
          href={currentWaystoContribute !== "Donate" ? downloadLink : undefined}
          on:click={() => {
            if (currentWaystoContribute === "Donate") wingetDialogOpen = true;
          }}
          {...(currentWaystoContribute !== "Donate" ? externalLink : undefined)}
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
    <Button on:click={copyWingetCommand} variant="accent">
      {wingetCommandCopied ? "Copied!" : "Copy"}
    </Button>
    <Button on:click={() => (wingetDialogOpen = false)}>Close</Button>
  </svelte:fragment>
</ContentDialog>

<style lang="scss">
  @use "HeroSection";
</style>
