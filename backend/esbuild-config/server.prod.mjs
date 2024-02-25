import * as esbuild from "esbuild";

try {
  await esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    sourcemap: true,
    minify: false,
    platform: "node",
    target: ["node18.16"],
    packages: "external",
    define: {
      "process.env.NODE_ENV": "'development'",
    },
    outfile: "dist/index.js",
  });

  console.log("Server bundled successfully for production!");
} catch (error) {
  console.error("An error occurred during bundling:", error);
  process.exit(1);
}
