import { Client, Stomp, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class WebSocketService {
    private client: Client;
    private connected: boolean = false;
    private subscriptions: Map<string, StompSubscription> = new Map();

    constructor() {
        this.client = new Client({
            // Use SockJS fallback
            webSocketFactory: () => new SockJS(`${API_URL.replace('/api/v1', '')}/ws`),
            debug: (str) => {
                // (str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
            // ('Connected to WebSocket');
            this.connected = true;
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        this.client.onWebSocketClose = () => {
            // ('WebSocket connection closed');
            this.connected = false;
        };
    }

    public async connect(): Promise<void> {
        if (!this.connected) {
            this.client.activate();
        }
    }

    public disconnect(): void {
        this.client.deactivate();
        this.connected = false;
    }

    public subscribe<T = unknown>(topic: string, callback: (message: T) => void): void {
        if (!this.client.connected) {
            // Queue subscription or retry? For now, just wait for connect
            const checkConnect = setInterval(() => {
                if (this.client.connected) {
                    clearInterval(checkConnect);
                    this.doSubscribe(topic, callback);
                }
            }, 500);
            return;
        }
        this.doSubscribe(topic, callback);
    }

    private doSubscribe<T>(topic: string, callback: (message: T) => void) {
        if (this.subscriptions.has(topic)) {
            return; // Already subscribed
        }

        const subscription = this.client.subscribe(topic, (message) => {
            if (message.body) {
                callback(JSON.parse(message.body));
            }
        });

        this.subscriptions.set(topic, subscription);
        // (`Subscribed to ${topic}`);
    }

    public unsubscribe(topic: string): void {
        const subscription = this.subscriptions.get(topic);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
            // (`Unsubscribed from ${topic}`);
        }
    }

    public isConnected(): boolean {
        return this.connected;
    }
}

export const webSocketService = new WebSocketService();
