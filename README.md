# test-utils README

WIP Test Utils to help in specs

## Features

- Cycle between your file and the test file (F1 > Find Match)

## Setup by project

Assuming your project is named `project-name` (eg. /home/user/workspace/project-name), on your `settings.json` file add the following:

```json
{
  "test-utils": {
    "local": {
      "project-name":  [
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
}
```
> The `**/*` is a required separator and it DOES NOT indicate a glob pattern.

With a file named `src/components/HelloWorld.vue` it will be replaced to `test/unit/specs/components/HelloWorld.spec.js`, and take you to the test file.
In this example we will replace `src` with `test/unit/specs` in all files with the extension `.vue` and `.js`.

`local` supports multiple projects and each project can have multiple file extensions, even with the same file extension.
- `filePath` is the path of your file
- `specPath` is the path of your test file


## Extension Settings


## Release Notes

WIP
