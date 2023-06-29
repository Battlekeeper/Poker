import { WebSocketServer } from 'ws';


function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
function random(){
    return Math.random();
}


export default function ExampleModule() {
    
    const wss = new WebSocketServer({ port: 2999});
    console.log('Initialized Websocket Server')

    wss.on('connection', async function connection(ws) {
        ws.on('message', function message(data) {
            ws.send(random());
        });
    });
}