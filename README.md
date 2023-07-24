# test-util

Test Utils to help in specs

## Features

- Cycle between your file and the test file (F1 > Find Match)

## Initial Setup

### resolves

`resolves` key is the global configuration, that will apply for all workspaces, and is recommended to be used in the User Settings(`settings.json`) file

```jsonc
// settings.json
{
  "test-utils": {
    "resolves":  [
      {
        "filePath": "src/**/*.vue",
        "specPath": "test/unit/specs/**/*.spec.js",
      },
      {
        "filePath": "src/**/*.js",
        "specPath": "test/unit/specs/**/*.spec.js",
      },
      {
        "filePath": "app/**/*.rb",
        "specPath": "spec/**/*_spec.rb",
      },
      {
        "filePath": "**/*.go",
        "specPath": "**/*_test.go",
      },
    ]
  }
}
```
> The `**/*` is a required separator and it DOES NOT indicate a glob pattern.


With a file named `src/components/HelloWorld.vue` it will be replaced to `test/unit/specs/components/HelloWorld.spec.js`, and take you to the test file.
In this example we will replace `src` with `test/unit/specs` in all files with the extension `.vue` and `.js`.

### localResolves

`localResolves` key is recommended for a specific project configuration using the Workspace Settings(`.vscode/settings.json`) file

It takes precedence over the `resolves` key, but don't override by default (if you want to override declare the `resolves` key as an empty array)

```jsonc
// .vscode/settings.json
{
  "test-utils": {
    "localResolves":  [
      {
        "filePath": "src/**/*.vue",
        "specPath": "test/unit/**/*.spec.js",
      }
    ]
  }
}
```


## Know Issues

- This extension is not compatible with multiple workspaces at the same time.

## Release Notes

WIP
