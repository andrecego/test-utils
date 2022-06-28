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
      "project-name": [
        {
          "fileExtension": ".vue",
          "specExtension": ".spec.js",
          "replaceFrom": "src",
          "replaceTo": "test/unit/specs"
        },
        {
          "fileExtension": ".js",
          "specExtension": ".spec.js",
          "replaceFrom": "src",
          "replaceTo": "test/unit/specs"
        },
      ]
    }
  }
}
```

In this example we will replace `src` with `test/unit/specs` in all files with the extension `.vue` and `.js`.

eg. `src/components/HelloWorld.vue` will be replaced with `test/unit/specs/components/HelloWorld.spec.js`, and take you to the test file.

`local` supports multiple projects and each project can have multiple file extensions, even with the same file extension.
- `fileExtension` is the extension of the file you want to cycle between
- `specExtension` is the extension of the test file
- `replaceFrom` is the folder of your file
- `replaceTo` is the folder of your spec


## Extension Settings


## Release Notes

WIP
