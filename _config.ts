import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import esbuild from "lume/plugins/esbuild.ts";
import typography from "npm:@tailwindcss/typography@0.5.9";
import markdownItAsciiMath from "npm:@widcardw/markdown-it-asciimath@0.5.5";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.5.0/toc.ts";
import * as tocAnchor from "https://deno.land/x/lume_markdown_plugins@v0.5.0/toc/anchors.ts";
import minifyHTML from "lume/plugins/minify_html.ts";

const site = lume(
  {},
  {
    markdown: {
      keepDefaultPlugins: true,
      plugins: [
        // [
        //   markdownItAsciiMath,
        //   {
        //     block: ["am"],
        //     inline: {
        //       open: "`$",
        //       close: "$`",
        //     },
        //     enableOriginalKatex: true,
        //   },
        // ],
      ],
    },
  }
);

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
site.use(minifyHTML());

export default site;
