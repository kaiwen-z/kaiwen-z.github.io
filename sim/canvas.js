import {Simulator} from "./simulator.js";
import {CONNECTOR,GATE,PORT,TOOL} from "./Enumeration.js";

function initCircuitSim() {
    let mouseDx, mouseDy;
    let currX = 0;
    let currY = 0;
    let prevX = 0;
    let prevY = 0;
    var speed = 10;

    let canvas = document.querySelector('canvas');
    let c = canvas.getContext('2d');

    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    let scaleX = canvasWidth / Math.max(canvas.getBoundingClientRect().width, 1);
    let scaleY = canvasHeight / Math.max(canvas.getBoundingClientRect().height, 1);

    let offsetX = canvas.offsetLeft;
    let offsetY = canvas.offsetTop;

    ['INPUT', 'OUTPUT'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.setAttribute('height', '50');
            el.setAttribute('width', '50');
        }
    });

    let images = [];
    images.push(document.getElementById("NOT-GATE"));
    images.push(document.getElementById("AND-GATE"));
    images.push(document.getElementById("OR-GATE"));
    images.push(document.getElementById("NAND-GATE"));
    images.push(document.getElementById("NOR-GATE"));
    images.push(document.getElementById("XOR-GATE"));
    images.push(document.getElementById("XNOR-GATE"));
    images.push(document.getElementById("INPUT"));
    images.push(document.getElementById("OUTPUT"));
    let sim = new Simulator(c,images);

    function resize(){
        resizeCanvas();
    }

    function resizeCanvas(){
        var wrap = document.getElementById('myCanvas');
        if (!wrap) {
            return;
        }
        var rect = wrap.getBoundingClientRect();
        var bottomPad = 20;
        var rawH = Math.floor(window.innerHeight - rect.top - bottomPad);
        var height = Math.max(240, Math.min(rawH, 4000));
        var width = Math.max(200, Math.floor(rect.width) || window.innerWidth - 80);
        c.canvas.width = width;
        c.canvas.height = height;
        var rw = canvas.getBoundingClientRect().width;
        var rh = canvas.getBoundingClientRect().height;
        scaleX = rw > 0 ? canvas.width / rw : 1;
        scaleY = rh > 0 ? canvas.height / rh : 1;
        offsetX = canvas.offsetLeft;
        offsetY = canvas.offsetTop;
    }

    function updateMousePos(e){
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = canvas;

        do{
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while(currentElement = currentElement.offsetParent)

        canvasX = e.pageX - totalOffsetX;
        canvasY = e.pageY - totalOffsetY;

        prevX = currX;
        prevY = currY;
        currX = canvasX;
        currY = canvasY;

        mouseDx = currX - prevX;
        mouseDy = currY - prevY;
    }

    function handleMouseDown(e) {
        updateMousePos(e);
        $("#downlog").html("Down: " + currX + " / " + currY);
        sim.handleMouseDown(currX, currY, mouseDx, mouseDy);
    }

    function handleMouseUp(e) {
        updateMousePos(e);
        $("#uplog").html("Up: " + currX + " / " + currY);
        sim.handleMouseUp(currX, currY, mouseDx, mouseDy);
    }

    function handleMouseOut(e) {
        updateMousePos(e);
        $("#outlog").html("Out: " + currX + " / " + currY);
        sim.handleMouseOut(currX, currY, mouseDx, mouseDy);
    }

    function handleMouseMove(e) {
        updateMousePos(e);
        $("#movelog").html("Move: " + currX + " / " + currY);
        sim.handleMouseMove(currX, currY, mouseDx, mouseDy);
    }

    let timeWindow = 500; // time in ms
    let lastExecution = new Date((new Date()).getTime() - timeWindow);

    $("#canvas").mousedown(function (e) {
        handleMouseDown(e);
    });
    $("#canvas").mousemove(function (e) {
        handleMouseMove(e);

    });
    $("#canvas").mouseup(function (e) {
        handleMouseUp(e);
    });
    $("#canvas").mouseout(function (e) {
        handleMouseOut(e);
    });
    $(window).resize(function () {
        resize();
    });
    resize();
    requestAnimationFrame(function () {
        requestAnimationFrame(resize);
    });
    timeout();
    function timeout() {
        setTimeout(function () {
            sim.simulate(currX,currY);
            timeout();
        }, speed);
    }

    function clearButtons(){
        $(".button-remove").prop('disabled', false);
        $(".button-move").prop('disabled', false);
        $(".button-edge").prop('disabled', false);
    }

    $(".button-remove").click(function(){
        clearButtons();
        $(".button-remove").prop('disabled', true);
        sim.setTool(TOOL.DELETE);
    });
    $(".button-move").click(function(){
        clearButtons();
        $(".button-move").prop('disabled', true);
        sim.setTool(TOOL.MOVE);
    });
    $(".button-edge").click(function(){
        clearButtons();
        $(".button-edge").prop('disabled', true);
        sim.setTool(TOOL.WIRE);
    });
    $(".button-add").click(function(){
        clearButtons();
    });

    $(".button-not").click(function(){
        sim.setComponent(GATE.NOT);
    });
    $(".button-and").click(function(){
        sim.setComponent(GATE.AND);
    });
    $(".button-or").click(function(){
        sim.setComponent(GATE.OR);
    });
    $(".button-nor").click(function(){
        sim.setComponent(GATE.NOR);
    });
    $(".button-nand").click(function(){
        sim.setComponent(GATE.NAND);
    });
    $(".button-xor").click(function(){
        sim.setComponent(GATE.XOR);
    });
    $(".button-xnor").click(function(){
        sim.setComponent(GATE.XNOR);
    });
    $(".button-in").click(function(){
        sim.setComponent(GATE.IN);
        sim.setTool(TOOL.PORT);
    });
    $(".button-out").click(function(){
        sim.setComponent(GATE.OUT);
        sim.setTool(TOOL.PORT);
    });
    $(".wire-type").change(function(){
        let wiretype = $(".wire-type").val();
        sim.setWiretype(wiretype);
        console.log(wiretype);
    });

    $("#slider1").change(function(e){
        speed = $("#slider1").val();
    });

    $(".button-truthtable").click(function(){
        let truthtable = sim.generateTruthTable();
        let elmt = document.getElementById("truthtablemodal");
        let html = "";
        if(typeof truthtable === 'string' || truthtable instanceof String){
            html = truthtable;
        }
        else{
            for(let i = 0; i < truthtable.length; i++){
                let inputs = truthtable[i].inputs;
                let outputs = truthtable[i].outputs;
                let vars = truthtable[i].vars;
                let name = truthtable[i].name;
                let equation = truthtable[i].equation;

                //for each var, add header to table
                html += '<h4>Equation: '+equation+'</h4>';
                html += '<table class="table"><thead><tr>';
                for(let x = 0; x < vars.length; x++){
                    html += '<th scope="col">'+vars[x]+'</th>';
                }
                html += '<th scope="col">'+name+'</th>';
                html += '</tr></thead><tbody><tr>';
                //for each input row
                for(let x = 0; x < inputs.length; x++){
                    //for each current input
                    let curr = inputs[x];
                    for(let k = 0; k < curr.length; k++){
                        html += '<td>'+curr[k]+'</td>';
                    }
                    html += '<td>'+outputs[x]+'</td>';
                    html += '</tr>';
                }
                html += '</tbody></table>';
            }
        }
        elmt.innerHTML = html;
    });

}

if (document.readyState === 'complete') {
    initCircuitSim();
} else {
    window.addEventListener('load', initCircuitSim);
}
