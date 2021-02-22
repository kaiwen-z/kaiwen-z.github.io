import {Connector} from "./Connector.js";
import {fold,or,and,xor,uuidv4,pDistance} from "./Functions.js";
import {CONNECTOR,GATE,PORT,TOOL} from "./Enumeration.js";
import {Action,ActionBuilder} from "./Action.js";
import {Simulator} from "./simulator.js";

export class WireHandler{
    constructor(action,components,connectors,wires){
        this.action = action;
        this.components = components;
        this.connectors = connectors;
        this.wires = wires;
        this.wiretype = true;
        this.hover = null;
        this.drawing = false;
    }

    updateState(state){
        for(let key in this.wires){
            delete this.wires[key];
        }
        let wires = state.wires;
        for(let i = 0; i < wires.length; i++){
            let id = wires[i].id;
            let start = wires[i].start;
            let end = wires[i].end;
            let x = wires[i].startx;
            let y = wires[i].starty;
            if(!this.connectors[start] || !this.connectors[end]){
                let newWire;
                if(this.connectors[start]){
                    if(this.connectors[start].getType() == CONNECTOR.IN){
                        newWire = new Wire(id,null,this.connectors[start]);
                    }
                    else{
                        newWire = new Wire(id,this.connectors[start],null);
                    }
                    
                    //this.connectors[start].addWire(newWire);
                    newWire.wiretype = this.wiretype;
                    newWire.updateHover(x,y);
                    this.wires[newWire.getID()] = newWire;
                }
                else if(this.connectors[end]){
                    if(this.connectors[end].getType() == CONNECTOR.IN){
                        newWire = new Wire(id,null,this.connectors[end]);
                    }
                    else{
                        newWire = new Wire(id,this.connectors[end],null);
                    }
                    newWire.wiretype = this.wiretype;
                    newWire.updateHover(x,y);
                    this.wires[newWire.getID()] = newWire;
                }

            }
            else{
                let newWire;
                if(this.connectors[start].getType() == CONNECTOR.OUT){
                    newWire = new Wire(id,this.connectors[start],this.connectors[end]);
                }
                else{
                    newWire = new Wire(id,this.connectors[end],this.connectors[start]);
                }
                newWire.wiretype = this.wiretype;
                this.wires[id] = newWire;
                this.connectors[start].addWire(newWire);
                this.connectors[end].addWire(newWire);
            }
        }
    }

    static getJSON(wires){
        let output = {};
        let wirelist = [];
        for(let key in wires){
            if(wires.hasOwnProperty(key)){
                let curr = wires[key];
                let wire = {};
                wire["id"] = curr.getID();
                if(curr.getStart() && curr.getEnd()){
                    wire["start"] = curr.getStart().getID();
                    wire["end"] = curr.getEnd().getID();
                }
                else{
                    //the wire is being hovered
                    wire["startx"] = curr.getX();
                    wire["starty"] = curr.getY();
                    if(curr.getStart()){
                        wire["end"] = curr.getStart().getID();
                    }
                    else{
                        wire["end"] = curr.getEnd().getID();
                    }
                }
                wirelist.push(wire);
            }
        }
        output["wires"] = wirelist;
        return output;
    }

    //Checks if a wire can be started from this connection
    //A wire can be started iff:
    //the connector is an output type
    //the connector is an input type and has no other wires connected
    checkConnectable(connector){
        if(connector.type == CONNECTOR.OUT){
            return true;
        }
        //Input type connector, check if it has any wires already connected
        else{
            //Loop through all wires, check if this connector already has wire
            for(let key in this.wires){
                let curr = this.wires[key];
                //If connector already has a connection
                //This only works because the current drawn wire is not in wires[]
                //If it is there is possibility of null ptr!!!!
                if(curr.getID() && curr.getID() !== this.hover && curr.getEnd().getID() == connector.getID()){
                    return false;
                }
            }
        }
        return true;
    }
    //Checks if joining a wire at a given connection is valid.
    //A wire is valid iff:
    //the wire does not connect to any other connections with the same gateID
    //the wire connects to its opposite type (output to input, or input to output)
    //the connection has no wires already connected if it is of type input
    checkValid(wire, connector){
        //Wire is the wire we want to connect to potential connector
        let conGateID = connector.getGateID();
        let wireStart = null;
        if(wire.getStart()){
            wireStart = wire.getStart(); //start is of type connector
        }
        else{
            wireStart = wire.getEnd(); //end is of type connector
        }
        let wireGateID = wireStart.getGateID();
        //Check if wire connects to any other connections with same gateID as itself
        if(conGateID == wireGateID){
            return false;
        }
        //Check if the wire connents to its opposite type
        if(wireStart.getType() == connector.getType()){
            return false;
        }
        //Check if the connection already has a wire
        return this.checkConnectable(connector);
    }
    //Checks if a wire is being joined to its own start, if this happens it is
    //assumed that the user does not want to draw a wire
    checkCancel(wire, connector){
        let wireStart = null;
        if(wire.getStart()){
            wireStart = wire.getStart(); //start is of type connector
        }
        else{
            wireStart = wire.getEnd(); //end is of type connector
        }
        return (wireStart.getID() == connector.getID());
    }

    handleWireDown(x,y){
        if(!this.drawing){
            for(let key in this.connectors){
                if(this.connectors.hasOwnProperty(key) && 
                this.connectors[key].checkMouseHitbox(x,y) && 
                    this.checkConnectable(this.connectors[key]) &&
                    this.connectors[key] != this.connectors[this.hover]){
                    //If wire is being drawn backwards (output to input)
                    //switch the start and end connectors
                    if(this.connectors[key].getType() == CONNECTOR.IN){
                        let newWire = new Wire(uuidv4() ,null, this.connectors[key]);
                        newWire.updateHover(x,y);
                        newWire.wiretype = this.wiretype;
                        this.wires[newWire.getID()] = newWire;
                        this.hover = newWire.getID();
                    }
                    else{
                        let newWire = new Wire(uuidv4(), this.connectors[key], null);
                        newWire.updateHover(x,y);
                        newWire.wiretype = this.wiretype;
                        this.wires[newWire.getID()] = newWire;
                        this.hover = newWire.getID();
                    }
                    this.drawing = true;
                    
                    break;
                }   
            }
        }
        else{
            let cancel = true;
            for(let key in this.connectors){
                if(this.connectors.hasOwnProperty(key) && this.connectors[key].checkMouseHitbox(x,y)){
                    cancel = false;
                    if(this.checkCancel(this.wires[this.hover],this.connectors[key])){
                        this.cancelWire(x,y);
                        break;
                    }
                    if(this.drawing && this.checkValid(this.wires[this.hover],this.connectors[key])){
                        this.wires[this.hover].setEndpoint(this.connectors[key]);
                        let b = {};
                        b["hover"] = this.hover;
                        b["key"] = key;
                        this.hover = null;
                        this.drawing = false;
                        break;
                    }
                }
            }
            if(cancel){
                this.cancelWire(x,y);
            }
        }
    }
    checkHover(){
        return (this.hover && this.wires[this.hover]);
    }
    cancelWire(x,y){
        if(this.checkHover()){
            this.wires[this.hover].queueDelete();
        }
            
        this.hover = null;
        this.drawing = false;
    }

    hoverWire(x,y){
        if(this.checkHover() && this.wires[this.hover]){
            this.wires[this.hover].updateHover(x,y);
        }
    }

    handleDeleteDown(x,y){
        for(let key in this.wires){
            if(this.wires[key].checkMouseHitbox(x,y)){
                this.wires[key].queueDelete();
            }
        }
    }

    setWiretype(wiretype){
        this.wiretype = wiretype;
        for(let key in this.wires){
            this.wires[key].wiretype = wiretype;
        }
    }
}

export class Node{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    updatePoint(x,y){
        this.x = x;
        this.y = y;
    }
}

export class Wire{
    constructor(id,start,end){
        this.id = id;
        this.start = start;
        this.end = end;
        this.toDelete = false;
        this.lineWidth = 14;
        this.wiretype = true;

        let x, y;
        if(this.start){
            x = this.start.x;
            y = this.start.y;
        }
        else{
            x = this.end.x;
            y = this.end.y;
        }
        this.nodes = [];
        this.nodes.push(new Node(x,y));
        this.nodes.push(new Node(x,y));
        this.hx = -1;
        this.hy = -1;
        
    }
    getX(){
        return this.hx;
    }
    getY(){
        return this.hy;
    }
    updatePosition(x,y){
        this.hx=x;
        this.hy=y;
    }
    getID(){
        return this.id;
    }
    getStart(){
        return this.start;
    }

    getEnd(){
        return this.end;
    }
    setStart(start){
        this.start = start;
    }

    updateValue(){
        if(!this.start || !this.end)
            return
        this.value = this.start.getValue();
        this.end.setValue(this.start.getValue());
    }

    queueDelete(){
        if(this.start){
            this.getStart().removeWire(this.getID());
        }
        if(this.end){
            this.getEnd().removeWire(this.getID());
        }
        this.toDelete = true;
    }

    checkDelete(){
        return this.toDelete;
    }

    checkMouseHitbox(x,y){
        if(!this.start || !this.end){
            return false;
        }

        let startx = this.start.getX();
        let starty = this.start.getY();

        let x0 = this.nodes[0].x;
        let y0 = this.nodes[0].y;

        let endx = this.end.getX();
        let endy = this.end.getY();

        let x1 = this.nodes[1].x;
        let y1 = this.nodes[1].y;

        if(pDistance(x,y,startx,starty,x0,y0) <= this.lineWidth) return true;
        if(pDistance(x,y,x0,y0,x1,y1) <= this.lineWidth) return true;
        if(pDistance(x,y,x1,y1,endx,endy) <= this.lineWidth) return true;
        return false;
    }

    setEndpoint(end){
        if(this.start){
            this.end = end;
        }
        else{
            this.start = end;
        }
    }

    calculateNodePos(x1,y1,x2,y2){
        let meanX = (x1 + x2)/2;
        let meanY = (y1+y2)/2;
        if(this.wiretype){
            this.nodes[0].x = x1;
            this.nodes[1].x = x2;
            this.nodes[0].y = y1;
            this.nodes[1].y = y2;
        }
        else{
            if(x1 < x2){
                this.nodes[0].x = meanX;
                this.nodes[1].x = meanX;
                this.nodes[0].y = y1;
                this.nodes[1].y = y2;
            }
            else{
                this.nodes[0].x = x1;
                this.nodes[1].x = x2;
                this.nodes[0].y = meanY;
                this.nodes[1].y = meanY;
            }
        }
    }
    updateHover(x,y){
        if(!this.start || !this.end){
            this.hx = x;
            this.hy = y;
        }
    }

    draw(c,x,y,xx,yy){
        c.strokeStyle = "black";
        c.beginPath();
        if(!this.start || !this.end){
            c.globalAlpha = 0.4;
        }
        else{
            c.globalAlpha = 1.0;
        }
        let x1, x2, y1, y2;
        if(this.start && !this.end){
            x1 = this.start.getX();
            y1 = this.start.getY();
            x2 = this.hx;
            y2 = this.hy;
        }
        else if(!this.start && this.end){
            x2 = this.end.getX();
            y2 = this.end.getY();
            x1 = this.hx;
            y1 = this.hy;
        }
        else{
            x1 = this.start.getX();
            y1 = this.start.getY();
            x2 = this.end.getX();
            y2 = this.end.getY();
        }
        this.calculateNodePos(x1,y1,x2,y2);
        c.lineJoin = "round";
        c.lineCap = "round";
        c.lineWidth = this.lineWidth;
        if(this.checkMouseHitbox(xx,yy)){
            c.strokeStyle = "red";
        }
        else if(this.checkMouseHitbox(x,y)){
            c.strokeStyle = "cyan";
        }
        else{
            c.strokeStyle = "black";
        }
        c.moveTo(x1, y1);
        for(let i = 0; i < this.nodes.length; i++){
            c.lineTo(this.nodes[i].x,this.nodes[i].y);
        }
        c.lineTo(x2, y2);
        c.stroke();
        c.closePath();
        c.lineWidth = this.lineWidth/2;
        if(this.value) c.strokeStyle = "yellow";
        else c.strokeStyle = "grey";
        c.beginPath();
        c.moveTo(x1, y1);
        for(let i = 0; i < this.nodes.length; i++){
            c.lineTo(this.nodes[i].x,this.nodes[i].y);
        }
        c.lineTo(x2, y2);
        c.stroke();
        c.closePath();
    }
}
