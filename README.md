# ImageUp

# googlemap

has a working google map box 
has a basic messenger which saves messages to db and you can view them on user profile

technology:
- ws: websocket library
- dotenv, for env
- dropszone: For handling drag-and-drop file uploads

- websocket connection was failing on localhost:3001; this may be a bug with websocket. Had to make an env setting wds socket port to '0' and add 
- ' const WDS_SOCKET_PORT = process.env.WDS_SOCKET_PORT || PORT;' to server.js
- and 



create .env with:
```bash
WDS_SOCKET_PORT=0
```

add to server.js:
```bash
const WDS_SOCKET_PORT = process.env.WDS_SOCKET_PORT || PORT;
```

and:
```bash
    httpServer.listen(WDS_SOCKET_PORT, () => {...}...)
```