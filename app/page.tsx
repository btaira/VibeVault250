import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/types";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = {
  title: "VibeVault 250 — Project Showcase",
  description:
    "Explore the VibeVault 250 project showcase, learn how it works, and run it locally or in Docker.",
};

export default function ShowcasePage() {
  return (
    <main className="relative z-10 min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="mb-8 space-y-4 text-slate-100">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">VibeVault 250</p>
            <h1 className="text-4xl font-semibold sm:text-5xl">Project Showcase</h1>
            <p className="max-w-3xl text-slate-300 sm:text-lg">
              Browse the app that brings 250 AI project ideas to life. Filter ideas by category,
              explore idea prompts, and deploy the site locally or inside a Docker container.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold text-white">What this app does</h2>
              <ul className="space-y-3 text-slate-300">
                <li>• Showcases 250 project ideas organized by category</li>
                <li>• Lets you filter by SaaS, Creative, Utility, Social, and Deep Tech</li>
                <li>• Includes a surprise picker with a slot machine animation</li>
                <li>• Opens a deep dive modal with prompts, stack ideas, and difficulty</li>
                <li>• Is built with Next.js, React, Tailwind CSS, Framer Motion, and Zustand</li>
              </ul>
            </div>

            <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold text-white">Project details</h2>
              <p className="text-slate-300">
                The app contains {PROJECTS.length} ideas across {CATEGORIES.length} categories.
                Each idea includes a prompt, stack suggestions, and a difficulty rating.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/80 p-4"
                  >
                    <p className="text-2xl">{category.emoji}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{category.label}</p>
                    <p className="mt-1 text-sm text-slate-400">{category.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">View Live Demo</h2>
            <p className="mt-3 text-slate-300">
              Check out the deployed version of VibeVault 250 on GitHub Pages.
            </p>
            <a
              href="https://btaira.github.io/VibeVault250/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Open Live Site
            </a>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">App Screenshots</h2>
            <p className="mt-3 text-slate-300">
              Here's a visual overview of the app's key features and pages.
            </p>
            <div className="mt-6 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Home Page</h3>
                <p className="text-slate-400 mb-4">
                  The main browsing interface with category filters, project grid, and the surprise picker button.
                </p>
                <iframe
                  src="/home"
                  className="w-full h-96 rounded-2xl border border-white/10"
                  title="VibeVault 250 Home Page"
                ></iframe>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Interactive Features</h3>
                <p className="text-slate-400 mb-4">
                  Try the slot machine surprise picker and deep dive modals by visiting the live site.
                </p>
                <a
                  href="https://btaira.github.io/VibeVault250/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Try Interactive Features
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Run locally</h2>
            <p className="mt-3 text-slate-300">
              Use the regular Next.js workflow to install dependencies and start the development server.
            </p>
            <pre className="mt-4 rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-200">
              <code>npm install{`
`}npm run dev</code>
            </pre>
            <p className="mt-4 text-slate-300">
              Open <span className="font-medium text-white">http://localhost:3000</span> to view the app.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Docker</h2>
            <p className="mt-3 text-slate-300">
              The repository includes a multi-stage `Dockerfile` that builds the app for production and
              runs it on port 3000.
            </p>
            <pre className="mt-4 rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-200">
              <code>docker build -t vibevault-250 .{`
`}docker run --rm -p 3000:3000 vibevault-250</code>
            </pre>
            <p className="mt-4 text-slate-300">
              After the container starts, visit <span className="font-medium text-white">http://localhost:3000</span>.
            </p>
            <p className="mt-4 text-slate-300">
              If you publish the image to a registry, pull it using a command like:
            </p>
            <pre className="mt-2 rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-200">
              <code>docker pull &lt;username&gt;/vibevault-250:latest</code>
            </pre>
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Explore the app</h2>
              <p className="mt-2 text-slate-400">
                Visit the home page for interactive browsing, surprise picks, and modal idea details.
              </p>
            </div>
            <Link
              href="/home"
              className="inline-flex rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
