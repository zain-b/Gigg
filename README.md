# The Intelligent Web - Report


# Features/Achievements
- Decoupled client/server architecture with no dependencies between them.
- Batch/shell scripts provided to automatically install, build and run the app in 2 clicks.

### Server-side
- **Stateless Express server API** (no sessions) whilst also supporting **secure user authentication and authorization** using JSON Web Tokens (JWT) to encrypt user information. The API has an **MVC structure/design**.
- **Mongo database** with a relational design between models via Mongoose. Text fields are indexed for efficient search.
- **User passwords are hashed and salted** before entering the database or being compared for authentication using Mongo lifecycle hooks.
- Create events with title, description, photo, location by address, city, co-ordinates, date and creator. Requires authorisation.
- Create stories for events with TLDR (too long didn't read), description, multiple photos and creator. Requires authorisation.
- Search via API if client is online, otherwise locally.
- Automatically handle relations operations, e.g. if a story is created, since events have many stories the corresponding events stories array should be updated to include it, same goes for the user model etc.
- When running the server the database is wiped, dummy data is added to the database automatically just before running it.
- HTTPS secured.

To save time I skipped some features with very similar or trivial logic, e.g. deleting events/stories, adding comments, updating already posted things.
 
### Client-side
- **Angular 8 client** with the design split up into feature modules, shared modules, reusable components, services and helpers.
- Custom (not generated by Angular) **Service Worker** which uses a *network then latest cache strategy*. Newly fetched resources are cached automatically. User always has latest resources at point of going offline.
- Client side **Socket.io implementation** to continuously stay in sync with the server.
- Data is stored locally in **IndexedDB** and all GET requests use local data.
- The app is completely **functional offline** other than POST requests.
- When user goes offline, all POST forms are disabled.
- At the point of going offline the **user always has the most up to date data.**
- As soon as user is back online, data is synced with the server.

![](report-images/offline-sync.gif)

- Any changes on the server, e.g. new event posted, new story posted automatically show up on client UI without any page refresh.
- Client UI always informs user of application status e.g. offline, online, up to date, syncing, how many clients are connected etc.
- The app can be manually F5 refreshed or closed and reopened whilst offline remaining fully functional (awkward to achieve with Angular as all components have data wiped).
- The app is a **Single Page App (SPA)** in its entirety with everything updating without any page refresh.
- **LeafletJS** for location selection, viewing already selected locations e.g. for events and searching.
- Search events by map bounds ('Search this area').
- Upon successful authentication with server, an **encrypted authorisation token** is stored locally. If the token is stored, all HTTP requests through Angular are intercepted and the token is appended to request headers allowing the user to access secure API endpoints such as creating events and stories.
- The app is a **PWA - fast, reliable, installable and optimised**

![](report-images/pwa-lighthouse.png)

- **Fully responsive** design using Bootstrap 4.

![](report-images/responsive.png)

# Install & Run

The client and server both need their dependencies installed with npm. This can be done by manually navigating into their respective directories and executing commands or by running the batch/shell scripts provided in the root directory (see below).

## Install

First execute the installation script to install both the client and the server.

### Windows
```console
> install.bat
```
### Mac/Linux
```console
$ install.sh
```
To install manually, just navigate into the client and server directories and run `$ npm install` to install the dependencies.

## Run
Next, execute the script to automatically build the Angular client for production and start the server.

### Windows

```console
> build-client-run-server.bat
```

### Mac/Linux

```console
$ build-client-run-server.bat
```

To run the app manually first build the client by navigating into the client directory and executing the command below. 

```console
$ ng build --prod --output-hashing none
```
The `--prod` command enables the **service worker** and gets everything ready for production. The `--output-hashing none` command configures Angular to generate distribution files with fixed file names so that they can be cached by our service worker.

Next, start the server manually by executing the command below in the server directory.

```console
$ npm start
```

### Opening the App

In a browser of your choice navigate to the URL below to open the app.

```console
http://localhost:3001
```

**Note**: I've disabled HTTPS whilst working on localhost due to issues with auditing with applications such as Google Lighthouse when evaluating the app.
