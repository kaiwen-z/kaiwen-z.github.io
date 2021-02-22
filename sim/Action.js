export class ActionBuilder{
    constructor(){
    }
    static buildAction(x,y,action){
        let newAction = new Action();
        newAction.setX(x);
        newAction.setY(y);
        newAction.setAction(action);
        return newAction;
    }
}

export class Action{
    constructor(){
        this.action;
        this.x;
        this.y
        this.dx;
        this.dy;
        this.tool;
        this.component;
        this.object;
    }

    setX(x){
        this.x=x;
        return this;
    }
    setY(y){
        this.y=y;
        return this;
    }
    setDx(dx){
        this.dx=dx;
        return this;
    }
    setDy(dy){
        this.dy=dy;
        return this;
    }
    setTool(tool){
        this.tool=tool;
        return this;
    }
    setComponent(component){
        this.component=component;
        return this;
    }
    setObject(object){
        this.object=object;
        return this;
    }
    setAction(action){
        this.action=action;
        return this;
    }

    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    getDx(){
        return this.dx;
    }
    getDy(){
        return this.dy;
    }
    getTool(){
        return this.tool;
    }
    getComponent(){
        return this.component;
    }
    getObject(){
        return this.object;
    }
    getAction(){
        return this.action;
    }
}