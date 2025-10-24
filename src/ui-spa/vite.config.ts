/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import istanbul from "vite-plugin-istanbul";

export default defineConfig(({ command, mode }) => {
  const isIstanbulCoverage = process.env.ISTANBUL_COVERAGE === "1";
  const isProdBuild = command === "build" && mode === "production";
  const buildSourceMap = isIstanbulCoverage || !isProdBuild;

  return {
    build: { sourcemap: buildSourceMap },
    plugins: [
      react(),
      svgr(),
      isIstanbulCoverage &&
        istanbul({
          include: ["src/**/*.{ts,tsx,js,jsx}"],
          exclude: [
            "src/**/*.{test,spec}.ts",
            "src/**/*.{test,spec}.tsx",
            "src/mocks",
            "src/common/types",
            "src/auth/mock",
            "src/auth/no-auth",
            "src/auth/index.ts",
            "src/auth/userDetails.ts",
            "src/config.ts",
            "src/types.d.ts",
            "src/vite-env.d.ts",
            "src/main.tsx",
          ],
          requireEnv: false,
          forceBuildInstrument: true,
        }),
    ].filter(Boolean),
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/tests/setup.ts"],
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
      reporters: ["default", "junit"],
      outputFile: {
        junit: "./unit-test-results.xml",
      },
      coverage: {
        enabled: true,
        reporter: ["text", "json", "html", "cobertura"],
        provider: "v8",
        reportsDirectory: "./coverage/unit",
        include: ["src/**/*.{ts,tsx,js,jsx}"],
        exclude: [
          "src/**/*.{test,spec}.ts",
          "src/**/*.{test,spec}.tsx",
          "src/mocks",
          "src/common/types",
          "src/components/govuk",
          "src/components/*.tsx",
          "src/components/case-registration",
          "src/auth/mock",
          "src/auth/no-auth",
          "src/auth/index.ts",
          "src/auth/userDetails.ts",
          "src/config.ts",
          "src/types.d.ts",
          "src/vite-env.d.ts",
          "src/main.tsx",
        ],
      },
    },
    server: {
      port: 5173,
      strictPort: true,
    },
    preview: {
      port: 5173,
      strictPort: true,
    },
  };
});
