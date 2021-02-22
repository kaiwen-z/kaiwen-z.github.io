import {LogicGate,GateHandler} from "./LogicGate.js";
import {Port,PortHandler} from "./IOPorts.js";
import {Wire, WireHandler} from "./Wire.js";
import {Connector, ConnectorHandler} from "./Connector.js";
import {uuidv4} from "./Functions.js";
import {CONNECTOR,GATE,PORT,TOOL} from "./Enumeration.js";
import {Action,ActionBuilder} from "./Action.js";
import {Graph} from "./Graph.js";
import {BooleanExpression} from "./BooleanExpression.js";

//this file operates the simulator
export class Simulator{
    constructor(canvas,images){
        this.context = canvas;
        this.selectedTool = null;
        this.selectedComponent = null;
        this.action = new Action();
        this.x,this.y,this.z=false;

        this.images = images;
        this.components = {};
        this.ports = {};
        this.connectors = {};
        this.wires = {};
        this.gateHandler = new GateHandler(this.action,this.images,this.components,this.connectors,this.wires);
        this.portHandler = new PortHandler(this.action,this.ports,this.connectors,this.wires);
        this.wireHandler = new WireHandler(this.action,this.components,this.connectors,this.wires);
        this.connHandler = new ConnectorHandler(this.action,this.connectors,this.wires);

        this.timeWindow = 150; // time in ms
        this.lastExecution = new Date((new Date()).getTime() - this.timeWindow);
    }

    allowedUpdate(){
        if ((this.lastExecution.getTime() + this.timeWindow) <= (new Date()).getTime()) {
            this.lastExecution = new Date();
            return true;
        }
        return false;
    }

    updateState(state){
        let test = state;
        let x1 = test.connHandler;
        let x2 = test.wireHandler;
        let x3 = test.gateHandler;
        let x4 = test.portHandler;
        if(x1 && x2 && x3 && x4){
            this.connHandler.updateState(test.connHandler);
            this.wireHandler.updateState(test.wireHandler);
            this.gateHandler.updateState(test.gateHandler);
            this.portHandler.updateState(test.portHandler);
            this.updateCanvas(0,0);
            return;
        }

        let action = state.action;
        let x = state.x;
        let y = state.y;
        let object = state.object;
        if(action == "ADD"){
            this.connHandler.updateState(object.connHandler);
            this.wireHandler.updateState(object.wireHandler);
            this.gateHandler.updateState(object.gateHandler);
            this.portHandler.updateState(object.portHandler);
            this.updateCanvas(x,y);
        }
        else if(action == "PLACE"){
            this.components[object].setPlaced(true);
            this.updateCanvas(x,y);
        }
        else if(action == "HOVER"){
            this.components[object].updatePosition(x,y);
        }
        else if(action == "DRAWING"){
            this.wires[object].updateHover(x,y);
        }
        else if(action == "MOVE"){
           this.components[object].movePosition(x,y);
        }
        else if(action == "DELETE"){
            this.components[object].queueDelete();
            this.connHandler.updateConnectors();
            this.updateGates();
            this.updateWires();
            this.updateCanvas(x,y);
        }
        else if(action == "DELETEWIRE"){
            this.wires[object].queueDelete();
            this.updateCanvas(x,y);
        }
        else if(action == "PLACEWIRE"){
            let hover = object.hover;
            let key = object.key;
            this.wires[hover].setEndpoint(this.connectors[key]);
            this.connHandler.updateConnectors();
            this.updateGates();
            this.updateWires();
            this.updateCanvas(x,y);
        }
        else if(action == "HOVERPORT"){
            this.ports[object].updatePosition(x,y);
        }
        else if(action == "DELETEPORT"){
            this.ports[object].queueDelete();
            this.updateCanvas(x,y);
        }
        else if(action == "MOVEPORT"){
            this.ports[object].movePosition(x,y);
        }
        else if(action == "PLACEPORT"){
            this.ports[object].setPlaced(true);
        }
        else if(action == "TOGGLE"){
            this.ports[object].toggleValue();
        }
        else if(action == "MOUSE"){
            this.x=x;
            this.y=y;
            if(object!=null)
                this.z=object;
            this.updateCanvas(x,y);
        }
        else if(action == "MOUSEOUT"){
            this.x=null;
            this.y=null;
            this.updateCanvas(x,y);
        }
        this.connHandler.updateConnectors();
        this.updateGates();
        this.updateWires();
    }

    static getJSON(gates,connectors,wires,ports,hover){
        let output = {};
        output["connHandler"] = ConnectorHandler.getJSON(connectors,hover);
        output["wireHandler"] = WireHandler.getJSON(wires);
        output["gateHandler"] = GateHandler.getJSON(gates,hover);
        output["portHandler"] = PortHandler.getJSON(ports,hover);

        return output;
    }

    setTool(tool){
        this.selectedTool = tool;
    }

    setComponent(type){
        this.selectedTool = TOOL.ADD;
        this.selectedComponent = type;
    }

    handleMouseDown(x,y,dx,dy){
        if(this.selectedTool == TOOL.ADD){
            this.gateHandler.handleAddDown(x,y);
        }
        else if(this.selectedTool == TOOL.PORT){
            this.portHandler.handleAddDown(x,y);
        }
        else if(this.selectedTool == TOOL.DELETE){
            this.gateHandler.handleDeleteDown(x,y);
            this.portHandler.handleDeleteDown(x,y);
            this.wireHandler.handleDeleteDown(x,y);
        }
        else if(this.selectedTool == TOOL.MOVE){
            this.gateHandler.handleMoveDown(x,y);
            this.portHandler.handleMoveDown(x,y);
        }
        else if(this.selectedTool == TOOL.WIRE){
            this.wireHandler.handleWireDown(x,y);
        }
        this.updateCanvas(x,y);
        
        
        this.connHandler.updateConnectors();
        this.updateGates();
        this.updateWires();
        this.updateCanvas(x,y);
    }

    generateTruthTable(){
        let g = new Graph((Object.keys(this.components).length)
        +(Object.keys(this.ports).length));
        //Add all vertex to graph
        for(let key in this.components){
        let curr = this.components[key];
        curr = curr.getID();
        g.addVertex(curr);
        }
        for(let key in this.ports){
        let curr = this.ports[key];
        curr = curr.getID();
        g.addVertex(curr);
        }
        //iterate over all edges and add them to the graph
        for(let key in this.wires){
        let start = this.wires[key].getStart().getGateID();
        let end = this.wires[key].getEnd().getGateID();
        g.addEdge(start,end);
        }
        if(g.isCyclic()){
            return "error cannot calculate truth table of sequential circuit."+
            "'<br>Please remove any feedback loops in circuit, and try again.'";
        }
        else if(Object.keys(this.ports).length == 0){
            return "Please add inputs and outputs to generate a truth table."
        }

        let b = new BooleanExpression(this.ports,this.components,this.wires);
        b.buildExpression();
        return b.evaluateAll();
    }

    setWiretype(wiretype){
        if(wiretype == "straight"){
            this.wireHandler.setWiretype(true);
        }
        else {
            this.wireHandler.setWiretype(false);
        }
    }

    handleMouseUp(x,y,dx,dy){
        this.toString();
        if(this.selectedTool == TOOL.MOVE){
            this.gateHandler.handleMoveUp(x,y);
            this.portHandler.handleMoveUp(x,y,dx,dy);
        }
    }

    handleMouseOut(x,y,dx,dy){
        this.gateHandler.handleMouseOut(x,y);
        this.portHandler.handleMouseOut(x,y);
        this.updateCanvas(x,y);
    }

    handleMouseMove(x,y,dx,dy){
        if(this.selectedTool != TOOL.WIRE){
            this.wireHandler.cancelWire();
        }
        else{
            this.wireHandler.hoverWire(x,y);
        }
        if(this.selectedTool == TOOL.ADD){
            this.gateHandler.handleAddMove(this.selectedComponent,x,y);
        }
        else if(this.selectedTool == TOOL.PORT){
            this.portHandler.handleAddMove(this.selectedComponent,x,y);
        }
        else if(this.selectedTool == TOOL.MOVE){
            this.gateHandler.handleMoveMove(dx,dy);
            this.portHandler.handleMoveMove(dx,dy);
            
        }
        this.renderCanvas(x,y);
    }

    renderCanvas(x,y){
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        for(let key in this.wires){
            this.wires[key].draw(this.context,x,y,this.x,this.y);
        }
        for(let key in this.components){
            this.components[key].draw(this.context,x,y,this.x,this.y);
        }
        for(let key in this.ports){
            this.ports[key].draw(this.context,x,y,this.x,this.y);
        }
        for(let key in this.connectors){
            this.connectors[key].draw(this.context,x,y,this.x,this.y);
        }
        if(this.x && this.y){
            this.context.beginPath();
            this.context.globalAlpha = 1.0;
            this.context.lineWidth = 4;
            this.context.strokeStyle = "red";
            this.context.arc(this.x, this.y, 8, 2 * Math.PI, false);
            this.context.closePath();
            if(!this.z){
                this.context.globalAlpha = 0.4;
            }
            else{
                ;
            }
            this.context.stroke();
            this.context.globalAlpha = 1.0;
            
        }
    }

    simulate(x,y){
        this.updateGates();
        this.updateWires();
        this.renderCanvas(x,y);
        return;
    }

    updateGates(){
        for(let key in this.components){
            this.components[key].updateValue();
        }
    }

    updateWires(){
        for(let key in this.wires){
            this.wires[key].updateValue();
        }
    }

    updateCanvas(x,y){
        for(let key in this.wires){
            if(this.wires[key].checkDelete()){
                delete this.wires[key];
            }
        }
        for(let key in this.components){
            if(this.components[key].checkDelete()){
                delete this.components[key];
            }
        }
        for(let key in this.connectors){
            if(this.connectors[key].checkDelete()){
                delete this.connectors[key];
            }
        }
        for(let key in this.ports){
            if(this.ports[key].checkDelete()){
                delete this.ports[key];
            }
        }
        let inputs = 0;
        let outputs = 0;
        for(let key in this.ports){
            if(this.ports[key].getType() == GATE.IN){
                this.ports[key].setnum(inputs);
                inputs++;
            }
            else{
                this.ports[key].setnum(outputs);
                outputs++;
            }
        }
        this.renderCanvas(x,y);
    }
}
