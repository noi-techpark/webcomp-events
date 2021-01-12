# Events - Web component

A web component that shows the events stored in the Open Data Hub.

## Table of contents

- [Usage](#usage)
- [Gettings started](#getting-started)
- [Deployment](#deployment)
- [Docker environment](#docker-environment)
- [Information](#information)
<!-- - [Tests and linting](#tests-and-linting) -->

## Usage

Include the webcompscript file `dist/webcomp-events.js` in your HTML and define the web component like this:
```html
 <webcomp-events
    width="100%"
    height="500px"
    fontFamily="Arial"
    language="it"
    mapAttribution='Map Tiles &copy; <a href="http://developer.here.com">HERE</a>'
    currentLocation='{ "lat": 46.31, "lng": 11.26 }'
    tiles-url="https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey="
    modality="list"
></webcomp-events>
```

### Attributes

#### width

Give a fixed width to the component. Works only from desktop up. You can use whatever size unit you want.

Examples: `"100%" or "200px"`

#### height

Give a fixed height to the component. Works only from desktop up. You can use whatever size unit you want.

Example: `"500px" or "100%"`

#### fontFamily

Set the typeface.

Example: `"Arial"`

#### language

Set the default and starting language.

Example: `"en" or "de" or "it"`

#### mapAttribution

Set the acknowledgement for the map tiles provider.

Example: `'Map Tiles &copy; <a href="http://developer.here.com">HERE</a>'`

#### currentLocation

Set the starting point position on the map.

Example: `'{ "lat": 46.31, "lng": 11.26 }'`

#### tiles-url

Set the URL of the API that provides the tiles.

Example: `"https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey="`

#### modality

Set the default and starting value for the modality of the widget.

Example: `"list" or "map"`


## Getting started

These instructions will get you a copy of the project up and running
on your local machine for development and testing purposes.

### Prerequisites

To build the project, the following prerequisites must be met:

- Node 14.15.4 / Yarn 1.22.10

For a ready to use Docker environment with all prerequisites already installed
and prepared, you can check out the [Docker environment](#docker-environment)
section.

### Source code

Get a copy of the repository:

```bash
git clone git@github.com:noi-techpark/webcomp-events.git
```

Change directory:

```bash
cd webcomp-events/
```

### .env

Create a `.env` file in the main directory.
Fill it with this content:

```
TILES_API_KEY=YourKey
```

Replace `YourKey` with your API token to use the tiles and the search bar.

### Dependencies

Download all dependencies:

```bash
yarn install
```

### Build

Build and start the project:

```bash
yarn start
```

The application will be served and can be accessed at [http://localhost:8080](http://localhost:8080).

<!-- ## Tests and linting

The tests and the linting can be executed with the following commands:

```bash
npm run test
npm run lint
``` -->

## Deployment

To create the distributable files, execute the following command:

```bash
yarn build
```

## Docker environment

NOT IMPLEMENTED

For the project a Docker environment is already prepared and ready to use with all necessary prerequisites.

These Docker containers are the same as used by the continuous integration servers.

### Installation

Install [Docker](https://docs.docker.com/install/) (with Docker Compose) locally on your machine.

### Dependenices

First, install all dependencies:

```bash
docker-compose run --rm app /bin/bash -c "yarn install"
```

### Start and stop the containers

Before start working you have to start the Docker containers:

```
docker-compose up --build --detach
```

After finished working you can stop the Docker containers:

```
docker-compose stop
```

### Running commands inside the container

When the containers are running, you can execute any command inside the environment. Just replace the dots `...` in the following example with the command you wish to execute:

```bash
docker-compose run --rm app /bin/bash -c "..."
```

Some examples are:

```bash
docker-compose run --rm app /bin/bash -c "yarn start"
```

## Information

### Support

ToDo: For support, please contact [help@opendatahub.bz.it](mailto:help@opendatahub.bz.it).

### Contributing

If you'd like to contribute, please follow the following instructions:

- Fork the repository.

- Checkout a topic branch from the `development` branch.

- Make sure the tests are passing.

- Create a pull request against the `development` branch.

A more detailed description can be found here: [https://github.com/noi-techpark/documentation/blob/master/contributors.md](https://github.com/noi-techpark/documentation/blob/master/contributors.md).

### Documentation

More documentation can be found at [https://opendatahub.readthedocs.io/en/latest/index.html](https://opendatahub.readthedocs.io/en/latest/index.html).

### Boilerplate

The project uses this boilerplate: [https://github.com/noi-techpark/webcomp-boilerplate](https://github.com/noi-techpark/webcomp-boilerplate).

### License

The code in this project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3 license. See the [LICENSE.md](LICENSE.md) file for more information.
