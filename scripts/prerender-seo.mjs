import fs from "node:fs";
import path from "node:path";
import esbuild from "esbuild";

const ORIGIN = "https://getpyq.vercel.app";
const BRAND_NAME = "GetPYQ - BPUT Previous Year Question Papers";
const DIST_DIR = path.resolve(process.cwd(), "dist");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");

const SEMESTER_LABELS = [
  { sem: "1", label: "1st Sem", full: "1st Semester" },
  { sem: "2", label: "2nd Sem", full: "2nd Semester" },
  { sem: "3", label: "3rd Sem", full: "3rd Semester" },
  { sem: "4", label: "4th Sem", full: "4th Semester" },
  { sem: "5", label: "5th Sem", full: "5th Semester" },
  { sem: "6", label: "6th Sem", full: "6th Semester" },
  { sem: "7", label: "7th Sem", full: "7th Semester" },
  { sem: "8", label: "8th Sem", full: "8th Semester" },
];

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function loadTsData() {
  const result = await esbuild.build({
    stdin: {
      contents: `
        export { BRANCH_SEO_DATA } from "./src/data/branchSeo.ts";
      `,
      resolveDir: process.cwd(),
      loader: "ts",
    },
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
  });

  const code = result.outputFiles[0].text;
  const dataUrl = `data:text/javascript;base64,${Buffer.from(code, "utf8").toString("base64")}`;
  return await import(dataUrl);
}

function buildNavFooterShell(branchesList, mainContentHtml) {
  const branchNavLinks = branchesList
    .map(
      (b) =>
        `<li><a href="/branch/${escapeHtml(b.slug)}">BPUT ${escapeHtml(b.code)} (${escapeHtml(
          b.name
        )}) Previous Year Question Papers</a></li>`
    )
    .join("");

  const semesterNavLinks = SEMESTER_LABELS.map(
    (s) => `<li><a href="/browse?semester=${s.sem}">BPUT ${s.label} (${s.full}) PYQ PDF</a></li>`
  ).join("");

  return `
    <div data-prerendered-seo="true">
      <header>
        <nav aria-label="Primary Navigation">
          <a href="/">${escapeHtml(BRAND_NAME)}</a>
          <a href="/browse">Browse PYQ Library</a>
          <a href="/requests">Request Paper</a>
          <a href="https://bputresults.vercel.app/">BPUT Results</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/upload">Upload PYQ</a>
        </nav>
      </header>
      <main>${mainContentHtml}</main>
      <footer>
        <p>${escapeHtml(BRAND_NAME)} — Free community archive for Biju Patnaik University of Technology (BPUT) B.Tech students.</p>
        <nav aria-label="BPUT Engineering Branches"><ul>${branchNavLinks}</ul></nav>
        <nav aria-label="BPUT Semesters"><ul>${semesterNavLinks}</ul></nav>
        <nav aria-label="Footer Links">
          <a href="/sitemap">Sitemap</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/disclaimer">Disclaimer</a>
        </nav>
      </footer>
    </div>
  `.trim();
}

function injectRouteSeo(templateHtml, routeConfig) {
  const { title, description, keywords, canonicalUrl, jsonLdList = [], bodyHtml } = routeConfig;
  let html = templateHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );

  if (keywords) {
    html = html.replace(
      /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="keywords" content="${escapeHtml(keywords)}" />`
    );
  }

  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
  );

  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );

  html = html.replace(
    /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:url" content="${escapeHtml(canonicalUrl)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );

  if (jsonLdList.length > 0) {
    const scripts = jsonLdList
      .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
      .join("\n    ");
    html = html.replace("</head>", `    ${scripts}\n  </head>`);
  }

  html = html.replace(
    /<div\s+id="root"\s*><\/div>/i,
    `<div id="root">${bodyHtml}</div>`
  );

  return html;
}

async function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Missing build template at ${TEMPLATE_PATH}. Run vite build first.`);
  }

  const templateHtml = fs.readFileSync(TEMPLATE_PATH, "utf8");
  const { BRANCH_SEO_DATA } = await loadTsData();
  const branchesList = Object.values(BRANCH_SEO_DATA);

  // Pure Brand + University + Branch + Semester directory (zero hardcoded specific subjects)
  const branchDirectoryHtml = branchesList
    .map((b) => {
      const aliasLine = Array.isArray(b.aliases) ? b.aliases.join(", ") : b.code;
      const semLinks = SEMESTER_LABELS.map(
        (s) =>
          `<a href="/branch/${escapeHtml(b.slug)}?semester=${s.sem}">${escapeHtml(b.code)} ${s.label} PYQ</a>`
      ).join(" · ");

      return `
        <article>
          <h3><a href="/branch/${escapeHtml(b.slug)}">BPUT ${escapeHtml(b.name)} (${escapeHtml(b.code)}) Previous Year Question Papers</a></h3>
          <p>${escapeHtml(b.shortDesc)} Covers ${escapeHtml(aliasLine)} across 1st Sem, 2nd Sem, 3rd Sem, 4th Sem, 5th Sem, 6th Sem, 7th Sem, and 8th Sem.</p>
          <p>${semLinks}</p>
        </article>
      `;
    })
    .join("");

  const branchItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "BPUT Engineering Branches on GetPYQ",
    itemListElement: branchesList.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: `BPUT ${b.name} (${b.code}) Previous Year Question Papers`,
      url: `${ORIGIN}/branch/${b.slug}`,
    })),
  };

  const routes = [];

  // 1. Homepage (overwrite dist/index.html)
  routes.push({
    outputFile: path.join(DIST_DIR, "index.html"),
    title: BRAND_NAME,
    description:
      "GetPYQ - BPUT Previous Year Question Papers (PYQ) PDF for CSE, AIML, ECE, ETC, EE, EEE, Mechanical (ME), Civil (CE), Chemical (CHE), Automobile, Metallurgy (MME) & Biotech across 1st Sem to 8th Sem.",
    keywords:
      "GetPYQ, GetPYQ - BPUT Previous Year Question Papers, BPUT, BPUT PYQ, PYQ BPUT, Biju Patnaik University of Technology, CSE, AIML, Mechanical, ME, Civil, CE, Chemical, CHE, Automobile, Electrical, EE, EEE, Electrical and Electronics, ETC, ECE, Telecommunication, Biotech, Metallurgy, MME, 1st Sem, 2nd Sem, 3rd Sem, 4th Sem, 5th Sem, 6th Sem, 7th Sem, 8th Sem",
    canonicalUrl: `${ORIGIN}/`,
    jsonLdList: [
      branchItemListSchema,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is GetPYQ - BPUT Previous Year Question Papers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "GetPYQ is a free, student-built archive of BPUT (Biju Patnaik University of Technology) previous year question papers (PYQ) for B.Tech engineering branches including CSE, AIML, ECE, ETC, EE, EEE, Mechanical (ME), Civil (CE), Chemical (CHE), Automobile, Metallurgy (MME), and Biotech from 1st Sem to 8th Sem.",
            },
          },
          {
            "@type": "Question",
            name: "Which BPUT semesters and exam types are available on GetPYQ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "GetPYQ provides live BPUT Regular and Back previous year question papers PDF across 1st Sem, 2nd Sem, 3rd Sem, 4th Sem, 5th Sem, 6th Sem, 7th Sem, and 8th Sem.",
            },
          },
          {
            "@type": "Question",
            name: "How do I download BPUT PYQ PDFs on GetPYQ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Select your engineering branch (CSE, AIML, ME, EE, EEE, ECE, ETC, Civil, Chemical, Automobile, Metallurgy, Biotech) and semester (1st Sem to 8th Sem) on GetPYQ to preview and download question paper PDFs in one click with zero paywall.",
            },
          },
        ],
      },
    ],
    bodyHtml: buildNavFooterShell(
      branchesList,
      `
      <section>
        <h1>GetPYQ - BPUT Previous Year Question Papers</h1>
        <p>Crack every BPUT exam smarter with GetPYQ. Free archive of Biju Patnaik University of Technology (BPUT) previous year question papers (PYQ) PDF, regular and back exam papers for CSE, AIML, Mechanical (ME), Civil (CE), Chemical (CHE), Automobile, Electrical (EE), EEE (Electrical &amp; Electronics), ECE / ETC (Telecommunication), Biotech, and Metallurgy (MME) from 1st Sem to 8th Sem.</p>
        <a href="/browse">Browse PYQ Library</a>
        <a href="/upload">Upload a Paper</a>
      </section>
      <section>
        <h2>BPUT Engineering Branches &amp; Semesters (1st Sem to 8th Sem)</h2>
        ${branchDirectoryHtml}
      </section>
      `
    ),
  });

  // 2. Browse Library
  routes.push({
    outputFile: path.join(DIST_DIR, "browse.html"),
    title: "Browse BPUT PYQ Library (1st Sem to 8th Sem) | GetPYQ",
    description:
      "Browse GetPYQ - BPUT Previous Year Question Papers by branch (CSE, AIML, ME, EE, EEE, ECE, ETC, Civil, Chemical, Automobile, Metallurgy, Biotech) and semester (1st Sem to 8th Sem).",
    keywords:
      "GetPYQ, browse BPUT PYQ, BPUT question papers PDF, BPUT 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem PYQ, BPUT regular back paper",
    canonicalUrl: `${ORIGIN}/browse`,
    jsonLdList: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Browse BPUT PYQ Library | GetPYQ",
        url: `${ORIGIN}/browse`,
        isPartOf: { "@type": "WebSite", name: BRAND_NAME, url: `${ORIGIN}/` },
      },
      branchItemListSchema,
    ],
    bodyHtml: buildNavFooterShell(
      branchesList,
      `
      <h1>Browse BPUT Previous Year Question Papers (PYQ) Library</h1>
      <p>Filter live BPUT regular and back previous year question paper PDFs by branch, semester (1st Sem to 8th Sem), and exam year on GetPYQ.</p>
      ${branchDirectoryHtml}
      `
    ),
  });

  // 3. Dedicated Engineering Branch Pages (/branch/:slug) — purely branch + university + 1st-8th Sem
  for (const b of branchesList) {
    const aliasLine = Array.isArray(b.aliases) ? b.aliases.join(", ") : b.code;
    const semesterBlocks = SEMESTER_LABELS.map(
      (s) =>
        `<section><h3>BPUT ${escapeHtml(b.code)} ${s.label} (${s.full}) Previous Year Question Papers</h3><p>Browse and download live BPUT ${escapeHtml(b.name)} (${escapeHtml(aliasLine)}) ${s.label} regular and back exam PYQ PDFs on GetPYQ.</p></section>`
    ).join("");

    const canonical = `${ORIGIN}/branch/${b.slug}`;
    const pageTitle = `BPUT ${b.name} (${b.code}) PYQ | GetPYQ`;
    const pageDesc = `GetPYQ - BPUT Previous Year Question Papers PDF for ${b.name} (${aliasLine}) across 1st Sem, 2nd Sem, 3rd Sem, 4th Sem, 5th Sem, 6th Sem, 7th Sem & 8th Sem.`;

    routes.push({
      outputFile: path.join(DIST_DIR, "branch", `${b.slug}.html`),
      title: pageTitle,
      description: pageDesc,
      keywords: b.keywords,
      canonicalUrl: canonical,
      jsonLdList: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `BPUT ${b.name} (${b.code}) Previous Year Question Papers`,
          description: pageDesc,
          url: canonical,
          isPartOf: { "@type": "WebSite", name: BRAND_NAME, url: `${ORIGIN}/` },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
            { "@type": "ListItem", position: 2, name: "Engineering Branches", item: `${ORIGIN}/browse` },
            { "@type": "ListItem", position: 3, name: b.code, item: canonical },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `Where can I download BPUT ${b.code} (${b.name}) previous year question papers?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `You can preview and download live BPUT ${b.name} (${aliasLine}) previous year question papers PDF across 1st Sem to 8th Sem for free on GetPYQ.`,
              },
            },
            {
              "@type": "Question",
              name: `Which semesters are available for BPUT ${b.code} PYQ on GetPYQ?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `GetPYQ covers 1st Sem, 2nd Sem, 3rd Sem, 4th Sem, 5th Sem, 6th Sem, 7th Sem, and 8th Sem BPUT ${b.code} regular and back examination papers.`,
              },
            },
          ],
        },
      ],
      bodyHtml: buildNavFooterShell(
        branchesList,
        `
        <h1>BPUT ${escapeHtml(b.name)} (${escapeHtml(b.code)}) Previous Year Question Papers</h1>
        <p>${escapeHtml(b.shortDesc)} Branch keywords: ${escapeHtml(aliasLine)}, BPUT, Biju Patnaik University of Technology, PYQ.</p>
        <h2>BPUT ${escapeHtml(b.code)} Semesters (1st Sem to 8th Sem)</h2>
        ${semesterBlocks}
        `
      ),
    });
  }

  // 4. Static Informational & Community Pages
  const staticPages = [
    {
      slug: "requests",
      title: "Request Missing BPUT Question Paper | GetPYQ",
      description:
        "Request missing BPUT previous year question papers across any B.Tech branch and semester (1st Sem to 8th Sem) on GetPYQ.",
      h1: "Request a Missing BPUT Question Paper",
      body: "Post your BPUT engineering branch and semester request on the GetPYQ student board.",
    },
    {
      slug: "upload",
      title: "Upload BPUT Question Paper PDF | GetPYQ",
      description:
        "Upload and contribute BPUT previous year question papers (PYQ) PDF for CSE, AIML, ECE, ETC, EE, EEE, ME, Civil, Chemical, Automobile, Metallurgy, and Biotech on GetPYQ.",
      h1: "Upload BPUT Previous Year Question Papers",
      body: "Share BPUT regular and back-paper PDFs across 1st Sem to 8th Sem to help engineering students.",
    },
    {
      slug: "about",
      title: "About GetPYQ - BPUT Previous Year Question Papers",
      description:
        "Learn about GetPYQ - BPUT Previous Year Question Papers, the student-built academic archive covering all BPUT B.Tech engineering branches and semesters.",
      h1: "About GetPYQ - BPUT Previous Year Question Papers",
      body: "Built by BPUT students, for BPUT students — covering all 11 B.Tech branches across 1st Sem to 8th Sem.",
    },
    {
      slug: "contact",
      title: "Contact GetPYQ | BPUT Previous Year Question Papers",
      description:
        "Contact GetPYQ for support, paper updates, contributor questions, or archive removal requests.",
      h1: "Contact GetPYQ",
      body: "Reach out to the GetPYQ student community team for support, feedback, or archive updates.",
    },
    {
      slug: "sitemap",
      title: "Sitemap & BPUT Branches Directory | GetPYQ",
      description:
        "Complete directory index of all BPUT engineering branches (CSE, AIML, ECE, ETC, EE, EEE, ME, Civil, Chemical, Automobile, Metallurgy, Biotech) and semesters on GetPYQ.",
      h1: "GetPYQ Website Sitemap",
      body: "Browse every BPUT engineering branch archive and portal link on GetPYQ.",
    },
    {
      slug: "privacy",
      title: "Privacy Policy | GetPYQ",
      description:
        "Read the GetPYQ Privacy Policy covering anonymous browsing, optional contributor accounts, localStorage preferences, and PDF handling.",
      h1: "GetPYQ Privacy Policy",
      body: "Browse and download BPUT question papers anonymously with zero ad tracking cookies.",
    },
    {
      slug: "terms",
      title: "Terms of Use | GetPYQ",
      description:
        "Read the Terms of Use and community guidelines for GetPYQ - BPUT Previous Year Question Papers.",
      h1: "Terms of Use",
      body: "Guidelines for fair educational use and student contributions on GetPYQ.",
    },
    {
      slug: "disclaimer",
      title: "Academic Disclaimer | GetPYQ",
      description:
        "Read the GetPYQ academic disclaimer regarding BPUT (Biju Patnaik University of Technology) previous year question papers.",
      h1: "GetPYQ Academic Disclaimer",
      body: "GetPYQ is an independent student-run academic archive sharing past examination papers for educational revision.",
    },
  ];

  for (const p of staticPages) {
    routes.push({
      outputFile: path.join(DIST_DIR, `${p.slug}.html`),
      title: p.title,
      description: p.description,
      canonicalUrl: `${ORIGIN}/${p.slug}`,
      bodyHtml: buildNavFooterShell(
        branchesList,
        `<h1>${escapeHtml(p.h1)}</h1><p>${escapeHtml(p.body)}</p>`
      ),
    });
  }

  for (const route of routes) {
    fs.mkdirSync(path.dirname(route.outputFile), { recursive: true });
    const rendered = injectRouteSeo(templateHtml, route);
    fs.writeFileSync(route.outputFile, rendered, "utf8");
  }

  console.log(`Pre-rendered ${routes.length} SEO HTML routes in dist/ (branch + university + semester keywords only).`);
}

main().catch((err) => {
  console.error("SEO prerender failed:", err);
  process.exit(1);
});
