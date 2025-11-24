# amp.dev

Homepage of AMP Project.

## Setup

### Requirements

1. Install the LTS version of [Node.js](https://nodejs.org). An easy way to do so is by using [nvm](https://github.com/nvm-sh/nvm).

   ```sh
   $ nvm install --lts
   ```

1. Install Python 3 and ensure pip is properly set up by adding the _pip user base binary directory_ to `$PATH`.

   **macOS**

   1. Install [Homebrew](https://brew.sh/).
   1. Run the following command to ensure everything is up to date. Xcode version 10.3 or the most recent stable version is required.
      ```sh
      $ brew doctor
      ```
   1. Run the following command to install Python. Version 3.7 is required at latest.
      ```sh
      $ brew install python libyaml
      ```
   1. Run the following command to add the _pip user base binary directory_ to `$PATH`.
      ```sh
      $ echo "export PATH=\"$(python -m site --user-base)/bin\":\$PATH" >> ~/.bash_profile
      ```
   1. Run the following command for the changes to take effect.
      ```sh
      $ source ~/.bash_profile
      ```

   **Linux** (Debian-based)

   1. Run the following command to add the _pip user base binary directory_ to `$PATH`.
      ```sh
      $ echo "export PATH=\"$(python -m site --user-base)/bin\":\$PATH" >> ~/.bashrc
      ```
   1. Run the following command for the changes to take effect.
      ```sh
      $ source ~/.bashrc
      ```
   1. Run the following command to use a faster YAML parser.
      ```sh
      $ sudo apt install -y python-yaml libyaml-dev
      ```

1. Install [Grow](http://grow.io), the static site generator used to build amp.dev. Do so by using `pip` instead of its installer. Using `pip` will enable importing from the `grow` package in Python later on.

**Note**: Be sure to use the `pip` command associated with Python 3 as Grow 1 depends on Python 3.

**Mac**

```sh
  LDFLAGS="-L$(brew --prefix)/lib" CFLAGS="-I$(brew --prefix)/include" pip3 install --global-option="--with-libyaml" --force pyyaml
  pip3 install --user grow
```

**Linux**

```sh
 $ pip3 install --global-option="--with-libyaml" --force pyyaml
 $ pip3 install --user grow
```

### Fork & clone the repository

Fork the repository. Once you've done that you can clone the repository:

```sh
$ git clone https://github.com/YOUR-USERNAME/amp.dev
```

... and then install the dependencies via NPM:

```sh
$ cd amp.dev
$ npm install
```

## Develop

Bootstrap your local environment. To do so, make sure you have set up a valid [GitHub access token](https://github.com/settings/tokens) in an environment variable named `AMP_DOC_TOKEN` like so:

```sh
$ export AMP_DOC_TOKEN="c59f6..."
```

This command enables the import from GitHub to run flawlessly. The actual import occurs by running the following command, which will also build the Playground and Boilerplate Generator once.

```sh
$ npm run bootstrap
```

**Tip**: Due to bad network conditions or GitHub's API rate-limiting there might be errors during import. Try running the above command with the `-- --queue-imports` flag to prevent them.

You can then start developing in your local environment with the command below. The task will take care of building and copying all files, watching them for changes, and rebuilding them when needed. Beware that changes to the [Express](https://expressjs.com/) backend require the Gulp task to be restarted.

```sh
$ npm run develop
```

This command prints a lot to the shell and will most likely end on `Server ready. Press ctrl-c to quit.`. Seeing this line means everything went fine so far unless otherwise stated in the logs; the site should be available at [http://localhost:8080/](http://localhost:8080/). The service running on port `8081` is only Grow rendering the pages.

## Maintenance

### Documents

Made changes to a lot of Grow documents at once and not quite sure if all references are still valid? You can run `npm run lint:grow` to pick up broken ones.

### Run a test build

To run a local test build that does all the minifying and vends the static pages instead of proxying them through to Grow you can run:

```sh
$ npm run build:local
$ npm run start:local
```

**Tip**: For more rapid local testing, it may be preferable to only build a subset of specified locales. Run the following command with `--locales` being a comma seperated list of locale abbreviations you want to build, e.g. `en,fr` or even just `en`.

```sh
npm run build:local -- --locales <list of locales>
```

## Build

**Caution**: starting a build will automatically clean all locations of possible remainings from previous builds. Make sure you don't have anything there that you want to keep - additionally check your working copy for eventual unintended local changes.

```sh
npm run build:local -- --locales <list of locales>
```

To perform a build run the following command with `--env` being one of the following valid environments: `development`, `local`, `staging` or `production`:

```sh
$ npx gulp build --env <environment>
```

## Deployment

The amp.dev site uses GitHub Actions for automated deployments to both staging and production environments.

### Deployment Environments

- **Staging**: [staging-amp-dev.netlify.app](https://staging-amp-dev.netlify.app/)
- **Production**: [amp.dev](https://amp.dev/)

### How to Deploy

Deployments are triggered through GitHub Actions workflows:

1. **Staging Deployment**: 
   - Triggered automatically on pushes to the `main` branch
   - Automatically builds and deploys to the staging environment

2. **Production Deployment**:
   - **Manual deployment only** - no automatic triggers
   - Must be manually triggered through GitHub Actions

### Manual Deployment

To manually trigger a deployment (required for production):

1. Navigate to the [deploy workflow](https://github.com/ampproject/amp.dev/actions/workflows/deploy.yaml) in the GitHub actions tab.
2. Click "Run workflow" and choose the branch you want to deploy
3. Confirm the deployment

**Note**: Ensure your changes have been properly tested in the staging environment before deploying to production.
