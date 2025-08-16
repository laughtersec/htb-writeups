const config: QuartzConfig = {
  configuration: {
    pageTitle: "HackTheBox Writeups",
    // Change to your desired site title
    ...
    baseUrl: "laughtersec.github.io/htb-writeups",
    // Change to your site URL without https://.
    // This is your own domain,
    // or "<github-user-name>.github.io/<repository-name>" when using GitHub Pages.
    // See below for details
    ...
    defaultDateType: "modified",
    // Change to tell Quartz what date to display on notes
    // Valid options:
    // "created", use when the note was created.
    // "modified", use when the note was last modified.
    // "published", use when the note was published.
    // See Quartz docs for details.
    ...
    }
  }
  plugins: {
    transformers: [
      ...
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      // Sets how Quartz should resolve links between notes.
      // Should match the settings you use in Obsidian.
      // Valid options:
      // "shortest"
      // "relative"
      // "absolute"
      ...
    ]
    ...
  }
}
