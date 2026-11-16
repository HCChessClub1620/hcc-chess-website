const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const name of ["gallery-learn.js", "gallery-tournaments.js", "gallery-hall-of-fame.js", "gallery-rising-champions.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, "js", name), "utf8"), context);
}
const gallery = context.window.hccGallery;
const albums = ["learn", "compete", "trail", "spotlight"].flatMap((category) => gallery[category].albums);
const readPage = (album) => fs.readFileSync(
  path.join(root, "pages", "gallery", album.id.toLowerCase(), "index.html"), "utf8"
);
const meta = (html, attribute, name) => {
  const match = html.match(new RegExp(`<meta ${attribute}="${name}" content="([^"]*)" />`));
  assert.ok(match, `Missing ${name}`);
  return match[1];
};

test("album pages contain their source photos, unique static sharing metadata and working navigation", () => {
  const titles = new Set();
  const descriptions = new Set();
  const previews = new Set();
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

  albums.forEach((album, index) => {
    const html = readPage(album);
    const url = `https://hamiltonchessclub.org/pages/gallery/${album.id.toLowerCase()}/`;
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    const description = meta(html, "name", "description");
    const preview = meta(html, "property", "og:image");
    const photos = Array.from(html.matchAll(/<button class="album-photo"[^>]*><img src="([^"]+)" alt="([^"]+)"/g));

    assert.deepEqual(photos.map((photo) => photo[1]), Array.from(album.images), album.id);
    assert.ok(photos.every((photo) => photo[2]), `${album.id} image alt text`);
    assert.ok(html.includes(`<link rel="canonical" href="${url}" />`));
    assert.equal(meta(html, "property", "og:url"), url);
    assert.equal(meta(html, "property", "og:title"), title);
    assert.equal(meta(html, "property", "og:description"), description);
    assert.equal(meta(html, "property", "og:type"), "website");
    assert.ok(preview.startsWith("https://"));
    assert.ok(meta(html, "property", "og:image:alt"));
    assert.equal(meta(html, "name", "twitter:card"), "summary_large_image");
    assert.equal(meta(html, "name", "twitter:title"), title);
    assert.equal(meta(html, "name", "twitter:description"), description);
    assert.equal(meta(html, "name", "twitter:image"), preview);
    assert.ok(meta(html, "name", "twitter:image:alt"));
    assert.ok(sitemap.includes(`<loc>${url}</loc>`));
    assert.ok(html.includes('href="/pages/gallery/"'));
    for (const neighbor of [albums[index - 1], albums[index + 1]].filter(Boolean)) {
      assert.ok(html.includes(`href="/pages/gallery/${neighbor.id.toLowerCase()}/"`));
    }
    titles.add(title);
    descriptions.add(description);
    previews.add(preview);
  });

  assert.equal(titles.size, albums.length);
  assert.equal(descriptions.size, albums.length);
  assert.equal(previews.size, albums.length);
});

test("committed album pages and sitemap match the source data", () => {
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "generate-gallery-pages.js"), "--check"], {
    cwd: root, encoding: "utf8"
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("album dates are marked separately from other details", () => {
  const pages = new Map(albums.map((album) => [album.id, readPage(album)]));
  for (const album of albums.filter((entry) => entry.id !== "student-spotlight")) {
    assert.equal((pages.get(album.id).match(/class="album-date"/g) || []).length, 1, album.id);
  }
  assert.ok(pages.get("hamilton-scholastic-program-oct-2026").includes('<span class="album-date">Oct 2026</span>'));
  assert.ok(pages.get("hamilton-scholastic-winners-oct-2026").includes('Oct Classic - <span class="album-date">03 Oct 2026</span>'));
  assert.ok(pages.get("wisconsin-junior-open-nov-2026").includes('Manitowoc · <span class="album-date">14 NOV - 15 NOV 2026</span>'));
  assert.ok(!pages.get("student-spotlight").includes('class="album-date"'));
});

test("renamed albums use the requested names on their pages and when sharing", () => {
  const names = {
    "hamilton-scholastic-program-oct-2026": "HCC Hosted - OCT Scholastic Tournament Moments",
    "fall-kickoff-aug-2026": "HCC Fall Kick-Off Program",
    "summer-june-2026": "HCC Summer Program",
    "hamilton-scholastic-winners-oct-2026": "HCC Hosted - OCT Scholastic Tournament Winners",
    "fall-kickoff-sep-2026": "HCC Fall Kick-Off Tournament Winners",
    "summer-july-2026": "HCC Summer Tournament Winners"
  };
  for (const [id, name] of Object.entries(names)) {
    const album = albums.find((entry) => entry.id === id);
    assert.equal(album.headings[0], name);
    assert.equal(album.shareTitle, name);
    assert.ok(readPage(album).includes(`<h1>${name}</h1>`));
  }
});

test("the Rising Champions page uses the updated student names", () => {
  const names = {
    "shravan_sayv5m": "Shravan Sabarish",
    "shashwath_q7itkn": "Shashwath Sabarish",
    "Karthik_yqti7s": "Karthik Ramesh",
    "Vibha_wvax4e": "Vibha Iyer",
    "Neil_ciwgwf": "Neil Mathur",
    "copy_of_navya": "Navya Iyer",
    "Kian_zg1xeb": "Kian Batra",
    "RiyaGupta_cpebea": "Riya Gupta",
    "Hayan_lzfwrp": "Hayan Nissar"
  };
  const album = gallery.spotlight.albums[0];
  const html = readPage(album);
  for (const [image, name] of Object.entries(names)) {
    const student = gallery.spotlight.students.find((entry) => entry.image.includes(image));
    assert.equal(student.name, name);
    assert.ok(html.includes(`alt="${name} - ${student.description.replace(/&/g, "&amp;")}"`));
  }
});

test("Neil Mathur's achievements appear on his album photo", () => {
  const student = gallery.spotlight.students.find((entry) => entry.name === "Neil Mathur");
  assert.equal(student.description, "WSCF Champion & USCF Champion");
  assert.ok(readPage(gallery.spotlight.albums[0]).includes("Neil Mathur - WSCF Champion &amp; USCF Champion"));
});

test("the junior open champions' achievements appear on their album photos", () => {
  for (const name of ["Vibha Iyer", "Riya Gupta"]) {
    const student = gallery.spotlight.students.find((entry) => entry.name === name);
    assert.equal(student.description, "Wisconsin State Junior Open - Girls Champion");
    assert.ok(readPage(gallery.spotlight.albums[0]).includes(`${name} - Wisconsin State Junior Open - Girls Champion`));
  }
});
