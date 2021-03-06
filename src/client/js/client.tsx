import * as React from "react";
import {Component} from "react";
import * as io from "socket.io-client";
import Config from "../../global/config";
import Chat from "./chat";
import { Message } from "../../global/message";
import Username from "./username";

interface State {
    isConnected: boolean;
    messages: Message[];
    username: string;
    hasUsername: boolean;
}

export default class Client extends Component {
    public state: State;

    private socket: SocketIOClient.Socket;

    constructor(props: null) {
        super(props);
        this.state = {
            isConnected: false,
            messages: [],
            username: "anonymous",
            hasUsername: false
        };

        this.connect();
        
        this.sendMessage = this.sendMessage.bind(this);
        this.sendUsername = this.sendUsername.bind(this);
    }

    public render(): JSX.Element {
        return(
            <div>
                <h1>{this.state.isConnected ? "connected" : "disconnected"}</h1>
                {this.state.hasUsername ? <Chat messages={this.state.messages} sendMessage={this.sendMessage}/> : <Username sendUsername={this.sendUsername}/>}
            </div>
        )
    }

    private sendMessage(message: string): void {
        this.socket.emit("message", {username: this.state.username ,message});
        event.preventDefault();
    }

    private sendUsername(username: string): void {
        this.state.username = username;
        this.socket.emit("set_username", username);
        this.setState({hasUsername : true});
    }
    
    private setupSocket(): void {
        this.socket.on("connect", this.onConnect.bind(this));
        this.socket.on("disconnect", this.onDisconnect.bind(this));
        this.socket.on("message", this.onMessage.bind(this));
    }

    private onConnect(): void {
        this.setState({isConnected: true});
    }

    private onDisconnect(): void {
        this.setState({isConnected: false});
    }

    private onMessage(message: Message): void {
        const newMessages = [...this.state.messages,  message]
        this.setState({messages: newMessages});
    }

    private connect(): void {
        this.socket = io(`http://localhost:${Config.PORT}`);
        this.setupSocket();
    }

}
