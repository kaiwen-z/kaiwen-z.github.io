
# Simple Logic Circuit Simulator with truth table generator
This is a simple logic circuit simulator with realtime circuit simulation for combinational and sequential circuits.
The simulator can also produce truth tables and boolean equations expressing the simulated circuit.

Simple logic sim is written in entirely in javascript, and relies on HTML5 Canvas to render. Jquery libraries are imported for the purpose of easier form input.

### Demo
A live demo version is available [here](https://kaiwen-z.github.io/canvas).

The full repo including backend is WIP.

### Tools
Add - brings up GUI to select a component to add

Remove - Click on a component or wire to delete from the sim

Move - Click and drag components to move them around

![](media/LogicInput.png) Logic Input (click to toggle value)

![](media/LogicOutput.png) Logic Output (Required to generate truth tables)

## Features
Select between straight and square wire appearance

Change simulation speed to see logic circuits in action
  - lower delay means the sim runs faster
  - higher delay means the sim runs slower

Generate truth tables of your circuit
  - Truth tables require that the circuit be combinatorial in nature
  - Only circuits attached to Logic Input AND Logic Output are processed

## Author
👤 **[kaiwen-z](https://github.com/kaiwen-z)**

## License

[MIT](https://choosealicense.com/licenses/mit/)
