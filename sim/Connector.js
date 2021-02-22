import {CONNECTOR,GATE,PORT,TOOL} from "./Enumeration.js";

export class ConnectorHandler{
    constructor(action,connectors,wires){
        this.action = action;
        this.connectors = connectors;
        this.wires = wires;
    }

    updateState(state){
        for(let key in this.connectors){
            delete this.connectors[key];
        }
        let connectors = state.connectors;
        for(let i = 0; i < connectors.length; i++){
            let id = connectors[i].id;
            if(this.connectors[id]){
                continue;
            }
            let gateid = connectors[i].gateid;
            let x = connectors[i].x;
            let y = connectors[i].y;
            let dx = connectors[i].dx;
            let dy = connectors[i].dy;
            let type = connectors[i].type;
            let value = connectors[i].value;
            let size = connectors[i].size;
            //if(!this.connectors[id]){
            //id,gateID,type,init,size,offsetX,offsetY
            let newConnector = new Connector(id,gateid,type,value,size,dx,dy);
            newConnector.updatePosition(x,y);
            newConnector.setPlaced(true);
            this.connectors[id] = newConnector;
            //}
        }
    }

    static getJSON(conn,hover){
        let output = {};
        let connectors = [];
        for(let key in conn){
            if(conn.hasOwnProperty(key)){
                let curr = conn[key];
                let connector = {};
                if(!curr.getPlaced()){ //if not placed (might be hover)
                    if(curr.getGateID() != hover){ //if its not my hover, then dont send
                        continue;
                    }
                }
                connector["id"] = curr.getID();
                connector["gateid"] = curr.getGateID();
                connector["x"] = Math.round((curr.getX()+Number.EPSILON)*1000)/1000;
                connector["y"] = Math.round((curr.getY()+Number.EPSILON)*1000)/1000;
                connector["dx"] = curr.getOffsetX();
                connector["dy"] = curr.getOffsetY();
                connector["type"] = curr.getType();
                connector["value"] = curr.getValue();
                connector["size"] = curr.getSize();
                connectors.push(connector);
            }
        }
        output["connectors"] = connectors;
        return output;
    }

    updateConnectors(){
        for(let key in this.connectors){
            if(this.connectors.hasOwnProperty(key)){
                let connected = false;
                for(let k in this.wires){
                    if(this.wires[k].getStart() != null && this.wires[k].getStart().getID() == this.connectors[key].getID()){
                        connected = true;
                    }
                    else if(this.wires[k].getEnd() != null && this.wires[k].getEnd().getID() == this.connectors[key].getID()){
                        connected = true;
                    }
                }
                if(connected){
                    this.connectors[key].setConnected(true);
                }
                else{
                    this.connectors[key].setConnected(false);
                    this.connectors[key].setValue(false);
                }
            }
        }
        //Add wires to each connector
        for(let key in this.wires){
            if(this.wires[key].getStart()){
                let s = this.wires[key].getStart().getID();
                this.connectors[s].addWire(this.wires[key]);
            }
            if(this.wires[key].getEnd()){
                let e = this.wires[key].getEnd().getID();
                this.connectors[e].addWire(this.wires[key]);
            }
        }
    }
}


export class Connector{

    constructor(id,gateID,type,init,size,offsetX,offsetY){
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.d = size;
        this.type = type;
        this.value = init;
        this.placed = false;
        this.connected = false;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.wires = [];
        this.toDelete = false;
        this.gateID = gateID;
    }
    getSize(){
        return this.d;
    }
    getPlaced(){
        return this.placed;
    }

    getGateID(){
        return this.gateID;
    }
    
    getID(){
        return this.id;
    }

    getType(){
        return this.type;
    }

    queueDelete(){
        this.destroyWires();
        this.toDelete = true;
    }

    checkDelete(){
        return this.toDelete;
    }

    getWires(){
        return this.wires;
    }

    addWire(wire){
        let found = false;
        for(let i = 0; i < this.wires.length; i++){
            if(this.wires[i].getID() == wire.getID()){
                found = true;
            }
        }
        if(!found)
            this.wires.push(wire);
    }

    removeWire(id){
        for(let i = 0; i < this.wires.length; i++){
            if(this.wires[i].getID() == id){
                this.wires.splice(i, 1);
            }
        }
    }

    destroyWires(){
        let i = 0;
        while(i < this.wires.length){
            this.wires[i].queueDelete();
        }
    }

    updatePosition(x, y){
        this.x = x+this.offsetX;
        this.y = y+this.offsetY;
    }

    movePosition(x, y){
        this.x = this.x + x;
        this.y = this.y + y;
    }

    setPlaced(value){
        this.placed = value;
    }

    setValue(value){
        this.value = value;
    }

    setConnected(value){
        this.connected = value;
    }

    getValue(){
        return this.value;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getOffsetX(){
        return this.offsetX;
    }

    getOffsetY(){
        return this.offsetY;
    }

    checkMouseHitbox(x,y){
        let a = x - this.x;
        let b = y - this.y;
        return (Math.sqrt((a*a) + (b*b)) < (this.d * 2));
    }

    // draw the connector
    draw(c,x,y,xx,yy){
        if(!this.placed){
            c.globalAlpha = 0.4;
        }
        else{
            c.globalAlpha = 1.0;
        }
        c.beginPath();
        c.lineWidth = 4;
        if(this.checkMouseHitbox(xx,yy)) c.strokeStyle = "red";
        else if(this.checkMouseHitbox(x,y)) c.strokeStyle = "cyan";
        else c.strokeStyle = "black";
        c.arc(this.x, this.y, this.d, 2 * Math.PI, false);
        if(this.getValue()){
            c.fillStyle = "yellow";
            c.fill();
        }
        else{
            c.fillStyle = "grey";
            c.fill();
        }
        c.closePath();
        c.stroke();
    }
}
