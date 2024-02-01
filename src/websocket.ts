const host: string = process.env.NODE_ENV === 'production' ? window.location.host : 'localhost:8080'

export let send: (data: string) => void;
let onMessageCallback: (arg: string) => any;

const startWebsocketConnection = () => {
    const ws: WebSocket = new window.WebSocket(`ws://${host}/game`) || {};

    ws.onopen = () => {
        console.log('Opened websocket connection');
    };

    ws.onclose = (e: CloseEvent) => {
        console.log('Closed websocket connection: ', e.code, e.reason);
    }

    ws.onmessage = (e: MessageEvent<string>) => {
        console.log('Websocket packet received: ', JSON.stringify(e.data));
        onMessageCallback && onMessageCallback(e.data);
    };

    send = ws.send.bind(ws);
};

const registerOnMessageCallback = (fn: (arg: string) => any) => {
    onMessageCallback = fn
};

export { startWebsocketConnection, registerOnMessageCallback };
