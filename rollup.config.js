import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default [
  {
    input: "src/reactComponentLib.ts",
    external: Object.keys(pkg.peerDependencies || {}),
    plugins: [
      typescript({
        typescript: require("typescript")
      })
    ],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
      {
        file: "example/src/reactComponentLib.js",
        format: "es",
        banner: "/* eslint-disable */"
      }
    ]
  }
];
