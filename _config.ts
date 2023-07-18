import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import esbuild from "lume/plugins/esbuild.ts";
import typography from "npm:@tailwindcss/typography@0.5.9";
import markdownItAsciiMath from "npm:@widcardw/markdown-it-asciimath@0.5.5";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.5.0/toc.ts";
import * as tocAnchor from "https://deno.land/x/lume_markdown_plugins@v0.5.0/toc/anchors.ts";
import metas from "lume/plugins/metas.ts";
import sitemap from "lume/plugins/sitemap.ts";
import date from "lume/plugins/date.ts";
// minifyHTML make html broken some time,
// probably because of katex
// import minifyHTML from "lume/plugins/minify_html.ts";

const markdownPlugins = [];

if (Deno.env.get("DENDRON_DISABLE_KATEX") !== "true")
  markdownPlugins.push([
    markdownItAsciiMath,
    {
      block: ["am"],
      inline: {
        open: "`$",
        close: "$`",
      },
      enableOriginalKatex: true,
    },
  ]);

const location = new URL("https://notes.levirs.my.id");

const site = lume(
  {
    location,
  },
  {
    markdown: {
      keepDefaultPlugins: true,
      plugins: markdownPlugins,
    },
  }
);

site.filter("canonicalUrl", (arg) => {
  return new URL(arg, location).href;
});

site.use(
  toc({
    level: 1,
    anchor: tocAnchor.linkInsideHeader({
      placement: "before",
    }),
  })
);
site.copy("assets", "assets");
site.use(
  tailwindcss({
    extensions: [".html", ".js"],
    options: {
      theme: {
        extend: {
          spacing: {
            "78": "19.5rem",
          },
        },
      },
      plugins: [typography],
    },
  })
);
site.use(postcss());
site.use(esbuild());
site.use(metas());
site.use(sitemap());
site.use(date());
// site.use(minifyHTML());

export default site;
