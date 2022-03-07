<script lang="ts">
	import { links } from "$data/links";
	import { externalLink, HeaderChip, PageSection } from "$lib";
	import { Button } from "fluent-svelte";

	let scrollY: number;
</script>

<svelte:window on:scroll={() => window.requestAnimationFrame(() => scrollY = window.scrollY )} />

<PageSection id="design-section">
	<HeaderChip>Donate</HeaderChip>
	<h2>Keep this project alive</h2>
	<p>
		We are helping others with the help of our donors. Donate today.
	</p>
	<div class="buttons-spacer">
		<Button
			href="/"
			{...externalLink}
			variant="accent"
		>
			Fund a charity
		</Button>
		<Button variant="hyperlink"
		        href=""
		        {...externalLink}
		>
			Find a charity
		</Button>
	</div>
	<div class="design-image">
		<picture>
			<source
				media="(prefers-color-scheme: dark)"
				srcset="/screenshots/folder-list-dark.png"
			>
			<source
				media="(prefers-color-scheme: light)"
				srcset="/screenshots/folder-list-light.png"
			>
			<img
				alt="Files folder list screenshot"
				class="files-screenshot"
				height="768"
				src="/screenshots/folder-list-light.png"
				style:transform="translateY({Math.floor(scrollY / -10)}px)"
				width="1024"
			>
		</picture>
		<picture>
			<source
				media="(prefers-color-scheme: dark)"
				srcset="/screenshots/win11-dark.jpg"
			>
			<source
				media="(prefers-color-scheme: light)"
				srcset="/screenshots/win11-light.jpg"
			>
			<img
				alt="Windows 11 wallpaper"
				class="files-wallpaper"
				height="900"
				src="/screenshots/win11-light.jpg"
				width="1440"
			>
		</picture>
	</div>
</PageSection>

<style lang="scss">
	@use "DonateSection";
</style>
