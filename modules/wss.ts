import { WebSocketServer } from 'ws';
export default function ExampleModule() {
    
    const wss = new WebSocketServer({ port: 2999});
    console.log('Initialized Websocket Server')

    wss.on('connection', function connection(ws) {
        ws.on('message', function message(data) {
            console.log('received: %s', data);
        });

        ws.send('something');
    });
}