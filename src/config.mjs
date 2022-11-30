export const SITE = {
	name: 'betahero',

	origin: 'https://betahero.org',
	basePathname: '/',

	title: 'betahero | inspire, educate and mentor through technology for the heroes of tomorrow',
	description: 'a nonprofit designed to inspire, educate and mentor youth through technology for the heroes of tomorrow',

	googleAnalyticsId: "G-GJ39ZEDESJ", // or false,
	googleSiteVerificationId: 'cqsr47x74v4mgs623n4mbnmbkt5i2slyy2gbjpb7bgogg5ugsssa',
};

export const BLOG = {
	disabled: false,
	postsPerPage: 4,

	blog: {
		disabled: false,
		pathname: 'blog', // blog main path, you can change this to "articles" (/articles)
	},

	post: {
		disabled: false,
		pathname: '', // empty for /some-post, value for /pathname/some-post 
	},

	category: {
		disabled: false,
		pathname: 'category', // set empty to change from /category/some-category to /some-category
	},

	tag: {
		disabled: false,
		pathname: 'tag', // set empty to change from /tag/some-tag to /some-tag
	},
};
