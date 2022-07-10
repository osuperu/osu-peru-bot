<h1 align="center">osu! Perú Bot - Version 1.0</h1>

<p>
    A website and a discord bot for osu! purposes.  Its main feature is to authenticate users of a discord server through their osu! and discord accounts. It also provides discord slash commands related to osu!, mapping and more.
</p>
<br>

## Requeriments
- Node.js v16 or higher (Tested on v18.4.0)
- MongoDB v4 or higher (Tested on v5.0.9)
- Discord application with enabled bot account which can be created from [here](https://discord.com/developers/applications)
- osu! OAuth application which can be created from [here](https://osu.ppy.sh/home/account/edit)
- Sudo access

<br>

## Installation
- Clone the repository
```sh
git clone https://github.com/osuperu/osu-peru-bot.git && cd osu-peru-bot
```
- Install the needed dependencies
```sh
npm install
```
- Copy the configuration template `config.default.json` as `config.json`.
```sh
cp config.default.json config.json
```
- Edit all values of `config.json` with your favorite text editor.
```sh
nano config.json
```
- Build the client and the server.
```sh
npm run build:client && npm run build:server
```
- Finally, you can start the project.
```sh
npm run start
```

<br>

## Running the application as a service
- Create a new service file with your favorite text editor.
```sh
sudo nano /etc/systemd/system/osuperubot.service
```
- Paste the following into that new file.
```
[Unit]
Description=osu!Peru Bot Service

[Service]
ExecStart=/usr/bin/npm run start --prefix /folder/where/the/file/is/located
Restart=always

[Install]
WantedBy=multi-user.target
```
- Finally you can start the service.
```sh
sudo systemctl start osuperubot
```
- Additionally, if you want to start the service in boot, run the following.
```sh
sudo systemctl enable osuperubot
```

<br>

## For developers
### Architecture
- Client:
    - assets: Contains all assets such as images, videos or sound files.
    - components: Contains all Vue components.
    - i18n: Contains all translations as .ts files.
    - layouts: Contains all Vue-Layouts that can be set in the vue-router.
- Server:
    - discord: Contains everything needed to manage the instance of the discord bot
        - commands: Contains all the slash commands.
        - models: Contains all models, schemas and interfaces needed to manage the discord bot instance.
        - responses: Contains all the slash commands responses.
    - models: Contains all models and schemas needed for the business logic.
    - router: Contains all the classes that handle routing
        - api:
            - oauth:
                - discord: Contains all the necessary endpoints to link an discord account.
                - osu: Contains all the necessary endpoints to link an osu! account.
            - user: Contains a endpoint that provide information about a previously fully verified account (osu! account + Discord account).
    - scripts: Contains all scripts as .ts files that will be executed through a Cron every certain predefined time.
    - util: Contains classes that provide utility methods

<br>

## Thanks to
- **[Bora](https://github.com/Coderbora/):** for the base code.
- **[Luneah](https://ripple.moe/u/54458):** for the new logo for osu!Peru.