export class Graph {

    constructor(vertices){
        this.vertices = vertices;
        this.AdjList = new Map();

    }

    addVertex(v){
        this.AdjList.set(v, []);
    }

    addEdge(v,w){
        this.AdjList.get(v).push(w);
    }

    isCyclicUtil(i, visited, recStack){
        if(recStack[i])
            return true;
        
        if(visited[i])
            return false;
        
        visited[i] = true;
        recStack[i] = true;

        let children = this.AdjList.get(i);
        for(let c = 0; c < children.length; c++){
            if(this.isCyclicUtil(children[c],visited,recStack)){
                return true;
            }
        }
        recStack[i] = false;
        return false;
    }

    isCyclic(){
        let visited = {};
        let recStack = {};
        let keys = this.AdjList.keys();

        for(let key of keys){
            visited[key] = false;
            recStack[key] = false;
        }
        keys = this.AdjList.keys();
        for(let key of keys){
            if(this.isCyclicUtil(key, visited, recStack))
                return true;
        }
        return false;
        
    }

    printGraph(){
        var keys = this.AdjList.keys();

        for(let key of keys){
            let values = this.AdjList.get(key);
            let c = "";

            for(var j of values){
                c += j+" ";
            }
        }
    }
}
