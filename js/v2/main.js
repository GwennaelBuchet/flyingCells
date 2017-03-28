


let gl;

let shaderProgram;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();

let squares = [];
//buffers
let squareVertexPositionBuffer = null;
let squareVertexColorBuffer = null;

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function _loadShader(gl, id) {
    let shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    let source = "";
    let k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType === 3) {
            source += k.textContent;
        }
        k = k.nextSibling;
    }

    let shader;
    if (shaderScript.type === "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type === "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders() {
    let fragmentShader = _loadShader(gl, "fs-monochrome");
    let vertexShader = _loadShader(gl, "vs-simple");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function renderSquares() {

    let square = null;
    for (let i = 0, len = squares.length; i < len; i++) {

        square = squares[i];

        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(square.x, square.y, square.z));
        mat4.rotate(mvMatrix, mvMatrix, degToRad(angle), vec3.fromValues(0, 1, 0));

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
    }
}

let angle = 0;
function animateSquares() {
    angle += 0.5;
}

function initSquares() {
    //Let's define only 1 buffer th at will be used to render several squares.
    //That way we'll use less memory
    let buffers = Square.createBuffers();
    squareVertexPositionBuffer = buffers[0];
    squareVertexColorBuffer = buffers[1];

    squares = [
        new Square(0, 0, -10),
        new Square(-3, -3, -10),
        new Square(3, 3, -15)
    ];
}

/**
 * Main rendering loop
 */
function render() {
    requestAnimFrame(render);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

    renderSquares();
    animateSquares();
}

/**
 * Entry point for our application
 */
function main() {
    const canvas = document.getElementById("scene");

    initGL(canvas);
    initShaders();

    initSquares();

    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        render();
    }
}
