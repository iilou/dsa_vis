import {Node, Edge} from "./Prims"


const NODE_UNVISITED = 6;
const NODE_VISITED = 7;
const NODE_CURRENT = 8;
const NODE_NEIGHBOURS = 9;
const NODE_QUEUE = 10;
const NODE_NEXT = 11;

const EDGE_UNVISITED = 4;
const EDGE_VISITED = 5;
const EDGE_QUEUED = 6;
const EDGE_NEXT = 7;
const EDGE_NEIGHBOURS = 8;
const EDGE_RED = 9;

class Graph {
    constructor(){
        this.nodes = [];
        this.edges = [];

        this.start = null;

        this.queue = [];
        this.edgeQueue = [];
        this.visited = [];
        this.step = [];
        this.parent = [];

        this.queueHistory = [];
        this.edgeQueueHistory = [];

        this.nodeStateHistory = [];
        this.nodeDistHistory = [];
        this.edgeStateHistory = [];

        this.algorithm = "bfs";
        /*
            nodes:
            6 -> unvisited
            7 -> visited
            8 -> current
            9 -> neighbours
            10 -> queue
            11 -> next in queue

            prio -> 2 > 3 > 4 > 1 > 0

            edges:
            4 -> unvisited
            5 -> visited
            6 -> queued
            7 -> next
        */

        this.currentState = 0;
    }

    calc(){
        switch(this.algorithm){
            case "bfs":
                this.BFS();
                break;
            case "dfs":
                alert("DFS not implemented yet");
                return;
                // this.DFS();
                // break;
            case "dijkstra":
                this.Dijkstra();
                break;
            case "kruskall":
                this.Kruskall();
                break;
            case "prim":
                this.Prim();
                break;
        }
    }

    /* ---------------------------------------------- BFS ---------------------------------------------- */
    BFS(){
        this.queue.push(0);
        this.edgeQueue.push(-1);

        this.nodeDistHistory[0][0] = 0;
        this.step[0] = 0;

        this.queueHistory.push(this.queue.slice());
        this.edgeQueueHistory.push([null]);

        let i = 1;
        while(this.queue.length > 0){
            let current = this.queue.shift();
            let currentEdge = this.edgeQueue.shift();

            if(this.visited[current]){
                continue;
            }

            this.visited[current] = true;
            this.nodeStateHistory[i-1][current] = 11;

            this.nodeStateHistory.push([]);
            this.nodeDistHistory.push([]);
            this.edgeStateHistory.push([]);

            for(let j = 0; j < this.nodes.length; j++){
                if(j === current){
                    this.nodeStateHistory[i][j] = 8;
                } else if(this.queue.includes(j) && !this.visited[j]){
                    this.nodeStateHistory[i][j] = 10;
                } else if(this.visited[j]){
                    this.nodeStateHistory[i][j] = 7;
                } else {
                    this.nodeStateHistory[i][j] = 6;
                }
            }

            for(let edgeDest in this.nodes[current].edges){
                let node2index = this.nodes.findIndex((node) => (""+node.id) === edgeDest);
                let edgeindex = this.edges.findIndex((edge) => ((this.nodes[current].id === edge.node1.id && edgeDest === ""+edge.node2.id) || (this.nodes[current].id === edge.node2.id && edgeDest === ""+edge.node1.id)));

                if(!this.visited[node2index]){
                    this.queue.push(node2index);
                    this.edgeQueue.push(edgeindex);
                    this.nodeStateHistory[i][node2index] = 9;
                    this.step[node2index] = this.step[node2index] === -1 ? this.step[current] + 1 : Math.min(this.step[node2index], this.step[current] + 1);
                }
            }

            for(let j = 0; j < this.nodes.length; j++){
                this.nodeDistHistory[i][j] = this.step[j];
            }

            for(let j = 0; j < this.edges.length; j++){
                this.edgeStateHistory[i][j] = this.edgeStateHistory[i-1][j];
            }
            if(currentEdge !== -1){
                this.edgeStateHistory[i][currentEdge] = 5;
            }

            this.queueHistory.push(this.queue.slice());
            this.edgeQueueHistory.push(this.edgeQueue.slice());

            i++;
        }

        
        // after BFS
        this.nodeStateHistory.push([]);
        this.nodeDistHistory.push([]);
        this.edgeStateHistory.push([]);

        for(let j = 0; j < this.nodes.length; j++){
            if(this.visited[j]){
                this.nodeStateHistory[i][j] = 7;
            } else {
                this.nodeStateHistory[i][j] = 6;
            }

            this.nodeDistHistory[i][j] = this.step[j];
        }

        for(let j = 0; j < this.edges.length; j++){
            this.edgeStateHistory[i][j] = this.edgeStateHistory[i-1][j];
        }

        this.queueHistory.push([]);
        this.edgeQueueHistory.push([]);

        console.log("done " + i, this.nodeStateHistory, this.nodeDistHistory, this.edgeStateHistory);
    }

    /* ---------------------------------------------- Dijsktra ---------------------------------------------- */
    Dijkstra(){
        function par(a,b,c,d,e){let f=a[b[d]].weight,g=c-1;for(let h=c;h<d;h++){if(a[b[h]].weight<f){g++;[b[g],b[h]]=[b[h],b[g]];[e[g],e[h]]=[e[h],e[g]]}}[b[g+1],b[d]]=[b[d],b[g+1]];[e[g+1],e[d]]=[e[d],e[g+1]];return g+1;}
        function quicksort(e,i,l,h,n){if(l<h){let p=par(e,i,l,h,n);quicksort(e,i,l,p-1,n);quicksort(e,i,p+1,h,n);}}

        this.queue.push(0);
        this.edgeQueue.push(-1);

        // this.nodeStateHistory[0][0] = 11;
        this.nodeDistHistory[0][0] = 0;
        this.step[0] = 0;

        this.queueHistory = [this.queue.slice()];
        this.edgeQueueHistory = [this.edgeQueue.slice()];


        let i = 1;
        while(this.queue.length > 0){
            let minDistIndex = -1;
            let minDist = 999999;

            if(this.edgeQueue[0] == -1){
                minDistIndex = 0;
            } else {
                console.log("iter ", i, this.parent.slice());
                let len = this.queue.length;
                for(let j = 0; j < len; j++){
                    if(this.visited[this.queue[j]]) {
                        this.queue.splice(j, 1);
                        this.edgeQueue.splice(j, 1);
                        len--;
                        j--;
                    }
                }
                for(let j = this.queue.length - 1; j >= 0; j--){
                    if(this.step[this.parent[this.queue[j]]] + this.edges[this.edgeQueue[j]].weight < minDist){
                        minDist = this.step[this.parent[this.queue[j]]] + this.edges[this.edgeQueue[j]].weight;
                        minDistIndex = j;
                    }
                }
            }

            if(minDistIndex === -1){
                break;
            }

            let current = this.queue[minDistIndex];
            let currentEdge = this.edgeQueue[minDistIndex];

            this.queue.splice(minDistIndex, 1);
            this.edgeQueue.splice(minDistIndex, 1);

            this.visited[current] = true;
            this.nodeStateHistory[i-1][current] = 11;
            if(currentEdge!=-1) this.edgeStateHistory[i-1][currentEdge] = 7;

            this.nodeStateHistory.push([]);
            this.nodeDistHistory.push([]);
            this.edgeStateHistory.push([]);

            for(let j = 0; j < this.nodes.length; j++){
                if(j === current){
                    this.nodeStateHistory[i][j] = 8;
                } else if(this.queue.includes(j) && !this.visited[j]){
                    this.nodeStateHistory[i][j] = 10;
                } else if(this.visited[j]){
                    this.nodeStateHistory[i][j] = 7;
                } else {
                    this.nodeStateHistory[i][j] = 6;
                }
            }

            for(let edgeDest in this.nodes[current].edges){
                let node2index = this.nodes.findIndex((node) => (""+node.id) === edgeDest);
                let edgeindex = this.edges.findIndex((edge) => ((this.nodes[current].id === edge.node1.id && edgeDest === ""+edge.node2.id) || (this.nodes[current].id === edge.node2.id && edgeDest === ""+edge.node1.id)));

                if(!this.visited[node2index] && this.step[node2index] > this.step[current] + this.edges[edgeindex].weight){
                    if(this.step[node2index] < 999999){
                        let len = this.queue.length;
                        for(let k = 0; k < len; k++){
                            if(this.queue[k] == node2index){
                                this.queue.splice(k, 1);
                                this.edgeQueue.splice(k, 1);
                                len--;
                                k--;
                            }
                        }
                    }

                    this.queue.push(node2index);
                    this.edgeQueue.push(edgeindex);
                    // this.nodeStateHistory[i][node2index] = 9;
                    this.nodeStateHistory[i][node2index] = NODE_NEIGHBOURS;
                    this.edgeStateHistory[i][edgeindex] = EDGE_NEIGHBOURS;

                    this.step[node2index] = this.step[current] + this.edges[edgeindex].weight;
                    this.parent[node2index] = current;
                }
            }

            for(let j = 0; j < this.nodes.length; j++){
                this.nodeDistHistory[i][j] = this.step[j];
            }

            for(let j = 0; j < this.edges.length; j++){
                if(currentEdge !== -1 && j === currentEdge){
                    this.edgeStateHistory[i][j] = EDGE_RED;
                } else if(this.edgeQueue.includes(j) && this.edgeStateHistory[i][j] != EDGE_NEIGHBOURS){
                    this.edgeStateHistory[i][j] = EDGE_QUEUED;
                } else if(this.edgeStateHistory[i][j] != EDGE_NEIGHBOURS){
                    this.edgeStateHistory[i][j] = (this.edgeStateHistory[i-1][j] == EDGE_VISITED || this.edgeStateHistory[i-1][j] == EDGE_NEXT || this.edgeStateHistory[i-1][j] == EDGE_RED) ? EDGE_VISITED : EDGE_UNVISITED;
                }
            }

            quicksort(this.edges, this.edgeQueue, 0, this.edgeQueue.length - 1, this.queue);
            this.queueHistory.push(this.queue.slice());
            this.edgeQueueHistory.push(this.edgeQueue.slice());

            i++;
        }

        
        // after Graph
        this.nodeStateHistory.push([]);
        this.nodeDistHistory.push([]);
        this.edgeStateHistory.push([]);

        for(let j = 0; j < this.nodes.length; j++){
            if(this.visited[j]){
                this.nodeStateHistory[i][j] = 7;
            } else {
                this.nodeStateHistory[i][j] = 6;
            }

            this.nodeDistHistory[i][j] = this.step[j];
        }

        for(let j = 0; j < this.edges.length; j++){
            this.edgeStateHistory[i][j] = this.edgeStateHistory[i-1][j] == EDGE_RED ? EDGE_VISITED : this.edgeStateHistory[i-1][j];
        }

        this.queueHistory.push([]);
        this.edgeQueueHistory.push([]);

        console.log("done " + i, this.nodeStateHistory, this.nodeDistHistory, this.edgeStateHistory);
    }


    Kruskall(){
        var parentRef = {};

        for(let i = 0; i < this.nodes.length; i++){
            parentRef[this.nodes[i].id] = this.nodes[i].id;
        }

        function find(node){
            if(parentRef[node] == node){
                return node;
            }
            return find(parentRef[node]);
        }

        function union(node1, node2){
            return find(node1) == find(node2);
        }

        function unite(node1, node2){
            parentRef[find(node1)] = find(node2);
        }

        function partition(edges, edgeIndices, low, high){
            let pivot = edges[edgeIndices[high]].weight;
            let i = low - 1;
            for(let j = low; j < high; j++){
                if(edges[edgeIndices[j]].weight < pivot){
                    i++;
                    let temp = edgeIndices[i];
                    edgeIndices[i] = edgeIndices[j];
                    edgeIndices[j] = temp;
                }
            }

            let temp = edgeIndices[i+1];
            edgeIndices[i+1] = edgeIndices[high];
            edgeIndices[high] = temp;

            return i+1;
        }

        function quicksort(edges, edgeIndices, low, high){
            if(low < high){
                let pi = partition(edges, edgeIndices, low, high);

                quicksort(edges, edgeIndices, low, pi - 1);
                quicksort(edges, edgeIndices, pi + 1, high);
            }

        }

        this.edgeQueue = Array(this.edges.length);
        for(let i = 0; i < this.edges.length; i++){
            this.edgeQueue[i] = i;
        }

        quicksort(this.edges, this.edgeQueue, 0, this.edges.length - 1);

        var nodeIdToIndex = {};
        for(let i = 0; i < this.nodes.length; i++){
            nodeIdToIndex[this.nodes[i].id] = i;
        }

        for(let i = 0; i < this.edgeQueue.length; i++){
            this.queue.push(this.edges[this.edgeQueue[i]].node1.id);
        }

        this.nodeStateHistory = [Array(this.nodes.length).fill(6)];
        this.nodeDistHistory = [Array(this.nodes.length).fill(null)];
        this.edgeStateHistory = [Array(this.edges.length).fill(4)];

        this.queueHistory.push(this.queue.slice());
        this.edgeQueueHistory.push(this.edgeQueue.slice());

        console.log(this.queueHistory.length, this.edgeStateHistory.length, this.edgeStateHistory.slice());

        for(let i = 0; i < this.edgeQueue.length; i++){
            let node1 = this.edges[this.edgeQueue[i]].node1.id;
            let node2 = this.edges[this.edgeQueue[i]].node2.id;

            this.nodeStateHistory.push(Array(this.nodes.length).fill(6));
            this.nodeDistHistory.push(Array(this.nodes.length).fill(null));
            this.edgeStateHistory.push(Array(this.edges.length).fill(4));

            for(let j = 0; j < this.nodes.length; j++){
                this.nodeStateHistory[i+1][j] = 6 + (this.nodeStateHistory[i][j] == 7);
            }
            for(let j = 0; j < this.edges.length; j++){
                this.edgeStateHistory[i+1][j] = 4 + (this.edgeStateHistory[i][j] == 7 || this.edgeStateHistory[i][j] == 5);
            }

            // if not union -> use "next" label | if union -> use "queued" label
            if(!union(node1, node2)){
                unite(node1, node2);
                this.edgeStateHistory[i+1][this.edgeQueue[i]] = 7;

                this.nodeStateHistory[i+1][nodeIdToIndex[node1]] = 7;
                this.nodeStateHistory[i+1][nodeIdToIndex[node2]] = 7;
            } else {
                this.edgeStateHistory[i+1][this.edgeQueue[i]] = 6;
            }

            this.queueHistory.push(this.queue.slice().splice(i, this.queue.length - i + 1));
            this.edgeQueueHistory.push(this.edgeQueue.slice().splice(i, this.queue.length - i + 1));

            console.log(this.queueHistory.length, this.edgeStateHistory.length, this.edgeStateHistory.slice(), i);
        }

        let ql = this.nodeStateHistory.length;
        console.log(ql);

        this.nodeStateHistory.push(Array(this.nodes.length).fill(6));
        this.nodeDistHistory.push(Array(this.nodes.length).fill(null));
        this.edgeStateHistory.push(Array(this.edges.length).fill(4));

        for(let i = 0; i < this.nodes.length; i++){
            // this.nodeStateHistory[this.edgeQueue.length+1][i] = 6 + (this.nodeStateHistory[this.edgeQueue.length][i] == 7);
            this.nodeStateHistory[ql][i] = 6 + (this.nodeStateHistory[ql-1][i] == 7);
        }

        for(let i = 0; i < this.edges.length; i++){
            this.edgeStateHistory[ql][i] = 4 + (this.edgeStateHistory[ql-1][i] == 7 || this.edgeStateHistory[ql-1][i] == 5);
        }

        this.queueHistory.push([]);
        this.edgeQueueHistory.push([]);

        console.log("done ", this.nodeStateHistory, this.nodeDistHistory, this.edgeStateHistory, this.queueHistory, this.edgeQueueHistory);
    }

    Prim(){

        function par(a,b,c,d,e){let f=a[b[d]].weight,g=c-1;for(let h=c;h<d;h++){if(a[b[h]].weight<f){g++;[b[g],b[h]]=[b[h],b[g]];[e[g],e[h]]=[e[h],e[g]]}}[b[g+1],b[d]]=[b[d],b[g+1]];[e[g+1],e[d]]=[e[d],e[g+1]];return g+1;}
        function quicksort(e,i,l,h,n){if(l<h){let p=par(e,i,l,h,n);quicksort(e,i,l,p-1,n);quicksort(e,i,p+1,h,n);}}

        let nodeIdToIndex = {};
        for(let i = 0; i < this.nodes.length; i++){
            nodeIdToIndex[this.nodes[i].id] = i;
        }

        let edgeIndexFromNodeId = {};
        for(let i = 0; i < this.edges.length; i++){
            edgeIndexFromNodeId[this.edges[i].node1.id + ","+this.edges[i].node2.id] = i;
            edgeIndexFromNodeId[this.edges[i].node2.id + ","+this.edges[i].node1.id] = i;
        }

        this.queue = [0];
        this.edgeQueue = [-1];

        this.nodeStateHistory = [Array(this.nodes.length).fill(NODE_UNVISITED)];
        this.nodeDistHistory = [Array(this.nodes.length).fill(null)];
        this.edgeStateHistory = [Array(this.edges.length).fill(EDGE_UNVISITED)];

        this.queueHistory = [this.queue.slice()];
        this.edgeQueueHistory = [this.edgeQueue.slice()];

        let i = 1;
        console.log("start");
        while(this.queue.length > 0){
            let current = null;
            let currentEdge = null;
            if(this.edgeQueue[0] == -1){
                current = this.queue[0];
                currentEdge = -1;

                this.queue.shift();
                this.edgeQueue.shift();
            } else {
                console.log("preqs", this.queue, this.edgeQueue, this.edges, this.nodes);
                quicksort(this.edges, this.edgeQueue, 0, this.edgeQueue.length - 1, this.queue);
                while(true){
                    if(this.queue.length == 0){
                        break;
                    }

                    if(!this.visited[this.queue[0]]){
                        current = this.queue.shift();
                        currentEdge = this.edgeQueue.shift();
                        break;
                    } else {
                        this.queue.shift();
                        this.edgeQueue.shift();
                    }

                    console.log("queue");
                }

                if(current == null){
                    break;
                }
            }

            this.visited[current] = true;

            console.log("herer");
            for(let edgeDest in this.nodes[current].edges){ // edgeDest -> node id of the destination node
                let node2index = nodeIdToIndex[edgeDest];
                let edgeindex = edgeIndexFromNodeId[this.nodes[current].id + "," + edgeDest];

                if(!this.visited[node2index]){
                    this.queue.push(node2index);
                    this.edgeQueue.push(edgeindex);
                }
            }

            this.nodeStateHistory.push(Array(this.nodes.length).fill(NODE_UNVISITED));
            this.nodeDistHistory.push(Array(this.nodes.length).fill(null));
            this.edgeStateHistory.push(Array(this.edges.length).fill(EDGE_UNVISITED));

            this.nodeStateHistory[i-1][current] = NODE_NEXT;
            for(let j = 0; j < this.nodes.length; j++){
                if(j === current){
                    this.nodeStateHistory[i][j] = NODE_CURRENT;
                } else if(this.visited[j]){
                    this.nodeStateHistory[i][j] = NODE_VISITED;
                } else if(this.queue.includes(j)){
                    this.nodeStateHistory[i][j] = NODE_QUEUE;
                } else {
                    this.nodeStateHistory[i][j] = NODE_UNVISITED;
                }
            }

            this.edgeStateHistory[i-1][currentEdge] = EDGE_NEXT;
            for(let j = 0; j < this.edges.length; j++){
                if(j == currentEdge){
                    this.edgeStateHistory[i][j] = EDGE_VISITED;
                } else if(this.edgeQueue.includes(j)){
                    this.edgeStateHistory[i][j] = EDGE_QUEUED;
                } else {
                    this.edgeStateHistory[i][j] = (this.edgeStateHistory[i-1][j] == EDGE_VISITED || this.edgeStateHistory[i-1][j] == EDGE_NEXT) ? EDGE_VISITED : EDGE_UNVISITED;
                }
            }

            quicksort(this.edges, this.edgeQueue, 0, this.edgeQueue.length - 1, this.queue);

            this.queueHistory.push(this.queue.slice());
            this.edgeQueueHistory.push(this.edgeQueue.slice());

            i++;
            console.log("iter ", i);
        }

        this.nodeStateHistory.push(Array(this.nodes.length).fill(NODE_UNVISITED));
        this.nodeDistHistory.push(Array(this.nodes.length).fill(null));
        this.edgeStateHistory.push(Array(this.edges.length).fill(EDGE_UNVISITED));

        for(let j = 0; j < this.nodes.length; j++){
            if(this.visited[j]){
                this.nodeStateHistory[i][j] = NODE_VISITED;
            } else {
                this.nodeStateHistory[i][j] = NODE_UNVISITED;
            }
        }

        for(let j = 0; j < this.edges.length; j++){
            this.edgeStateHistory[i][j] = (this.edgeStateHistory[i-1][j] == EDGE_VISITED || this.edgeStateHistory[i-1][j] == EDGE_NEXT) ? EDGE_VISITED : EDGE_UNVISITED;
        }

        this.queueHistory.push([]);
        this.edgeQueueHistory.push([]);

        console.log("done ", this.nodeStateHistory, this.nodeDistHistory, this.edgeStateHistory, this.queueHistory, this.edgeQueueHistory);
    }

    construct(nodes, edges, algorithm){
        this.currentState = 0;
        this.nodes = nodes;
        this.edges = edges;

        this.visited = new Array(this.nodes.length).fill(false);
        this.queue = [];
        this.edgeQueue = [];
        this.step = new Array(this.nodes.length).fill(999999);
        this.parent = new Array(this.nodes.length).fill(-1);

        this.nodeStateHistory = [new Array(this.nodes.length).fill(6)];
        this.nodeDistHistory = [new Array(this.nodes.length).fill(999999)];
        this.edgeStateHistory = [new Array(this.edges.length).fill(4)];

        this.queueHistory = [];
        this.edgeQueueHistory = [];

        for(let i = 0; i < nodes.length; i++){
            nodes[i].dist = null;
        }

        this.algorithm = algorithm;

        this.calc();
    }

    queue(){
        
    }

    render(nodes, edges, nodeQueue, edgeQueue){
        if(this.currentState >= this.nodeStateHistory.length || this.currentState >= this.edgeStateHistory.length){
            alert("what??" + this.currentState + " " + this.nodeStateHistory.length + " " + this.edgeStateHistory.length);
            return null;
        }


        for(let i = 0; i < this.nodes.length; i++){
            nodes[i].state = this.nodeStateHistory[this.currentState][i];
            nodes[i].dist = this.nodeDistHistory[this.currentState][i];
        }

        for(let i = 0; i < this.edges.length; i++){
            edges[i].state = this.edgeStateHistory[this.currentState][i];
        }

        for(let i = 0; i < this.queueHistory[this.currentState].length; i++){
            nodeQueue.push(this.queueHistory[this.currentState][i]);
            edgeQueue.push(this.edgeQueueHistory[this.currentState][i]);
        }
    }

    next(){
        this.currentState += this.currentState < this.nodeStateHistory.length - 1 ? 1 : 0;
    }

    back(){
        this.currentState -= this.currentState > 0 ? 1 : 0;
    }

    clear(){
        this.currentState = 0;
        this.nodes = [];
        this.edges = [];
        this.start = null;

        this.queue = [];
        this.edgeQueue = [];

        this.visited = [];
        this.step = [];
        this.parent = [];
        this.nodeStateHistory = [];
        this.nodeDistHistory = [];
        this.edgeStateHistory = [];

        this.queueHistory = [];
        this.edgeQueueHistory = [];
    }
}

export default Graph;