var canvas = document.querySelector("#c");
var gl = canvas.getContext("webgl");
if (!gl){
    alert("no webgl for you!")
}else{
//function to create either a vertex shader or fragment shader
function createShader(gl, type, source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);

}
//define sources for the GLSL code to create shaders
var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

//combine vertex shader and fragment shader to create a program
function createProgram(gl, vertexShader, fragmentShader){
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success){
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);

}

var program = createProgram(gl, vertexShader, fragmentShader);
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//rendering code starts here
//resize canvas
//webglUtils.resizeCanvasToDisplaySize(gl.canvas)
function resizeCanvasToDisplaySize(canvas){
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (canvas.width !== displayWidth || canvas.height !== displayHeight){
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}
resizeCanvasToDisplaySize(gl.canvas);

//convert clipspace into screen space. -1, 1 in clip space maps to 0,width 
//or 0, height in screen pixels 
gl.viewport(0,0,gl.canvas.width, gl.canvas.height);
//clear the canvas with the color white
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
//tell webgl to use my program created earlier
gl.useProgram(program);
gl.enableVertexAttribArray(positionAttributeLocation);
//bind position buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//tell the attribute how to get data out of the positionBuffer
var size = 2; //2 components per iteration
var type = gl.FLOAT;// the data is 32bit floats
var normalize = false; // use the data as-is, don't normalize to (0,1) or (-1, 1)
var stride = 0 // each attribute is located immedietly after the previous one in memory
offset = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

//tell webgl to execute the glsl program
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 3;
gl.drawArrays(primitiveType, offset, count);
}