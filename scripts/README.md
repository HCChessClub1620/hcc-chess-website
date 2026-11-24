# Gallery album pages

Album data and photos are maintained in the `js/gallery-*.js` files. After changing
an album or the Rising Champions collection, run the following from the repository
root with Node.js 18 or later:

```text
node scripts/generate-gallery-pages.js
node --test tests/gallery-pages.test.js
```

Commit the generated album pages and sitemap with the data changes. The generator
reports obsolete generated pages for manual review rather than deleting them.
It also supports `--check` to verify that generated files are up to date.
