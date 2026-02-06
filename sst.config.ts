/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "site-v2",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: { region: "eu-west-2" },
        ...(input?.stage === "production" ? { cloudflare: "5.49.1" } : {}),
      },
    };
  },
  async run() {
    const site = new sst.aws.Astro("site-v2", {
      ...($app.stage === "production"
        ? {
            domain: {
              name: "haydonlam.com",
              redirects: ["www.haydonlam.com"],
              dns: sst.cloudflare.dns(),
            },
          }
        : {}),
    });

    return {
      url: site.url,
    };
  },
});
