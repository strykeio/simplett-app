# Stryke - Simple Time Tracker App

![simplett](https://strykeassets.fra1.digitaloceanspaces.com/simplett-stryke.png)

This repository contains an example of a Stryke app that works on its own, through the standard Stryke UI, but also with a custom front end (via Stryke's API).

The app is a simple time tracker that allows users to track their time against tasks and projects and to generate styled reports.  

[Stryke - Documentation](https://docs.stryke.io)

[Stryke](https://www.stryke.io)

### Live Demo

https://glitch.com/~stryke-simplett

## Stryke App 

This app uses the following features of Stryke:

* Store your activity logs, tasks and projects - [**data persistence**](https://docs.stryke.io/docs/entity)
* Lets users check in or out through a button on the standard user interface - [**button action**](https://docs.stryke.io/docs/action)
* Lets users check in or out via a call to the API - [**API action**](https://docs.stryke.io/docs/action)
* Generates reports of all activity in a specic time period - [**button action**](https://docs.stryke.io/docs/action)
* Style reports using an HTML template - [**templates**](https://docs.stryke.io/docs/template)
* A dedicated end user for every user of the app, to allow people to login the app - [**end users**](https://docs.stryke.io/docs/endusers)
* Access control to separate users' data, so that users only see their own data - [**eccess control**](https://docs.stryke.io/docs/accesscontrol)
* The Stryke API allows the custom front end to authenticate with Stryke, and interact with the app (list tasks and projects and edit existing logs) - [**Stryke API**](https://docs.stryke.io/docs/api)

## Front end

![frontend](https://strykeassets.fra1.digitaloceanspaces.com/simplett-frontend.png)

The front end for the 'simple time tracker' is functionaly and intentionally very basic. It is build using vanilla HTML + CSS + JS, to allow anyone to easily get into it. 

It provides: 
- A login screen to allow users to authenticate with the simple time tracker app
- A simple user interface where users can check in or out through a button and set the task and project of the last activity
- Comms layer with Stryke to perform data retrieve and creation with the auth token

## How to Use it

### Create a Simple Time Tracker app in Stryke

You can use the app template found under: `/stryke/simplett-app.json` to [import the Simple Time Tracker app under your Stryke account](https://docs.stryke.io/docs/appinstance#create-an-app-from-template).

1. Sign up to Stryke
2. Login to stryke with your new user
3. UNder your dashboard click on "Import from Template"
4. Select the "simplett-app.json" file

### Point to your app

Under `/js/stryke.js` change the value of `appName` to your app's unique name. 

## Repository Structure

This repository includes the source code for both the Stryke app and the custom front end. 

### Stryke App

Under the `/stryke` folder you will find the `simplett-app.json` file which you can use to import this app under your Stryke account as described above.

This file includes all parts of the app, including the script's source code. 

Just as a reference, you can also find the script's source code directly under the `/stryke/src` folder.

### Front end

The source code for the front end is all under the `/frontend` folder, which includes the HTML, JS and CSS. 



