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
      },
    };
  },
  async run() {
    new sst.aws.Astro("site-v2");
  },
});
