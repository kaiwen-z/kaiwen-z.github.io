import {CONNECTOR,GATE,PORT,TOOL} from "./Enumeration.js";
import {fold,or,and,xor,uuidv4} from "./Functions.js";

export class BooleanExpression{

    constructor(ports,components,wires){
        this.ports = ports;
        this.components = components;
        this.wires = wires;
        this.exprlist = [];
        this.exprstack = [];
        this.env = {};
        this.envlist = [];
        this.inputs = [];

        this.allcomponents = {...this.components};
        Object.assign(this.allcomponents,this.ports);

    }

    evaluateAll(){
        let results = [];
        //iterate through expr
        for(let i = 0; i < this.exprlist.length; i++){
            let result = {};
            let env = this.envlist[i];
            let inputs = this.generateInputs(Object.keys(env).length);
            result["vars"] = Object.keys(env);
            result["inputs"] = inputs;
            let outputs = [];

            for(let j = 0; j < inputs.length; j++){
                let input = inputs[j];
                let k = 0;
                for(let key in env){
                    //update environment
                    env[key] = input[k];
                    k++;
                }
                let res = (this.exprlist[i].evaluate(false,env)[0]) ? 1 : 0
                outputs.push(res);
            }
            result["outputs"] = outputs;
            result["name"] = "output"+i;
            result["equation"] = this.exprlist[i].p("");
            results.push(result);
        }
        return results;
    }

    buildExpression(){
        //build expression for each output
        for(let key in this.ports){
            if(this.ports[key].getType() == GATE.OUT){
                let expr = new ExpressionTree(GATE.OUT);
                this.exprlist.push(expr);
                this.exprstack = [];
                this.exprstack.push(expr);
                this.h1(this.ports[key]);
                this.envlist.push(this.env);
                this.env = {};
            }
        }
    }

    //returns string representation of equation
    getStr(expr){
        let str = this.exprlist[expr].p("");
        return str;
    }

    //returns all possible inputs for an expression
    generateInputs(size){
        let bits = size;
        let iter = 2**bits;
        let inputs = [];
        for(let i = 0; i < iter; i++){ //add list of binary to all lists 
            let input = [];
            for(let j = 0; j < bits; j++){ //make list of binary
                if(i & (1 << j)){
                    input.push(1);
                }
                else{
                    input.push(0);
                }
            }
            inputs.push(input);
        }
        return inputs;
    }

    h1(output){
        //get wire connected
        let wires = output.getConnector().getWires();
        for(let i = 0; i < wires.length; i++){
            //traverse
            let connectedGate = wires[i].getStart().getGateID();
            this.h2(this.allcomponents[connectedGate]);
        }
        return;
    }

    h2(component){
        //traverses the children components of this component
        if(component.getType() == GATE.IN){
            this.env[("input"+component.getNum())] = 0;
            let variable = new ExpressionTree("input"+component.getNum());
            this.exprstack[this.exprstack.length-1].addChild(variable);
            return;
        }
        let inputs = component.getInputs();

        //Add a child to the top of stack
        let child = new ExpressionTree(component.getType());
        this.exprstack[this.exprstack.length-1].addChild(child);
        this.exprstack.push(child);

        for(let i = 0; i < inputs.length; i++){ //iterate over input connectors
            let wires = inputs[i].getWires();
            if(wires.length == 0){
                let leaf = new ExpressionTree(GATE.NULL);
                this.exprstack[this.exprstack.length-1].addChild(leaf);
            }
            //iterate through all wires for this connector
            for(let j = 0; j < wires.length; j++){ //for each connected gate
                //for each wire, get the next component its attached to
                let start = wires[j].getStart().getGateID();
                this.h2(this.allcomponents[start]);
            }
        }
        this.exprstack.pop();
        return;
    }
}

export class ExpressionTree{
    constructor(op){
        this.op = op;
        this.children = [];
    }

    addChild(child){
        this.children.push(child);
    }

    evaluate(vals,env){
        if(typeof this.op != "number"){
            return env[this.op];
        }
        else if(this.op == GATE.NULL){
            return false;
        }
        //otherwise
        let values = [];

        for(let i = 0; i < this.children.length; i++){
            values.push(this.children[i].evaluate(vals,env));
        }
        switch(this.op){
            case GATE.NOT:
                return !(or(values));
            case GATE.AND:
                return (and(values));
            case GATE.OR:
                return (or(values));
            case GATE.NOR:
                return !(or(values));
            case GATE.NAND:
                return !(and(values));
            case GATE.XOR:
                return (xor(values));
            case GATE.XNOR:
                return !(xor(values));
            case GATE.OUT:
                return values;
        }
    }

    toStr(){
        switch(this.op){
            case GATE.NOT:
                op = "NOT";
                break;
            case GATE.AND:
                op = "AND";
                break;
            case GATE.OR:
                op = "OR";
                break;
            case GATE.NOR:
                op = "NOR";
                break;
            case GATE.NAND:
                op = "NAND";
                break;
            case GATE.XOR:
                op = "XOR";
                break;
            case GATE.XNOR:
                op = "XNOR";
                break;
            case GATE.IN:
                op = this.op;
                break;
            case GATE.OUT:
                op = this.op;
                break;
        }
        return op;
    }

    p(str){
        if(typeof this.op != "number"){
            return this.op;
        }
        else if(this.op == GATE.NULL){
            return "GND";
        }
        else if(this.op == GATE.OUT){
            for(let i = 0; i < this.children.length; i++){
                return this.children[i].p(str);
            }
        }
        //otherwise
        let values = [];
        let op = "";
        switch(this.op){
            case GATE.NOT:
                op = "NOT";
                break;
            case GATE.AND:
                op = "AND";
                break;
            case GATE.OR:
                op = "OR";
                break;
            case GATE.NOR:
                op = "NOR";
                break;
            case GATE.NAND:
                op = "NAND";
                break;
            case GATE.XOR:
                op = "XOR";
                break;
            case GATE.XNOR:
                op = "XNOR";
                break;
        }
        for(let i = 0; i < this.children.length; i++){
            values.push(this.children[i].p(str));
        }
        if(values.length == 1 && this.op == GATE.NOT){
            str += op+"("+values[0]+")";
        }
        else{
            str += "(";
            for(let i = 0; i < values.length; i++){
                if(i < values.length-1){
                    str += values[i]+" "+op+" ";
                }
                else{
                    str += values[i]+")";
                }
            }
        }
        return str;
    }
}
