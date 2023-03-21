# Just Dance Unlimited Monet

This repository contains the source code for a serverless replica of the popular game Just Dance Unlimited, named "Just Dance Unlimited Monet Server". The server is built using Cloudflare Workers and Google Drive API.

## WARNING
For now, the project is under development, so it may not work as intended.

## Installation
To install Just Dance Unlimited Monet Server, you need to follow these steps:

1. Install the Cloudflare Workers CLI by running the command ``` npm install -g @cloudflare/wrangler ```
2. Clone this repository to your local machine
3. Run the ``command npm install`` to install the required dependencies

To access Google Drive API, you need to create a project in the Google Developers Console. Then, follow these steps:

1. Open [Google Developers Console - GDrive API Pages](https://console.cloud.google.com/marketplace/product/google/drive.googleapis.com)
2. Click the "Create credentials" button and select "OAuth client ID"
3. Choose "Desktop app" as the application type and give it a name
4. Click "Create"

## Usage
To use Just Dance Unlimited Monet Server, you need to follow these steps:

1. Modify the jd2017.exe file on your Just Dance Unlimited client to connect to the server:
2. Run the command npm start to start the server

## Configuration
The configuration options for Just Dance Unlimited Monet Server are stored in the settings.json file in the root directory of the cloned repository.