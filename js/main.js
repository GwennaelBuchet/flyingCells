let gl;

let shaderProgram;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let squareVertexBuffer;

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

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


/**
 * Init a buffer for a square mesh
 * @param x left initial position
 * @param y top initial position
 * @param z z initial position
 * @param w width
 * @param h height
 */
function initSquareBuffer(x, y, z, w, h) {
    // initialize a buffer object for a square mesh
    squareVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
    let vertices = [
        x + w, y + h, z,
        x    , y + h, z,
        x + w, y    , z,
        x    , y    , z
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexBuffer.itemSize = 3;
    squareVertexBuffer.numItems = 4;
}

/**
 * Render 1 square at coordinates x, y & z
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @private
 */
function _renderSquare(x, y, z) {
    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(x, y, z));
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexBuffer.numItems);
}

/**
 * Main rendering loop
 */
function render() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

    _renderSquare(0, 0, -10);
    _renderSquare(-2, 0, -10);
    //_renderSquare(5, 5, -10);
}

/**
 * Entry point for our application
 */
function main() {
    const canvas = document.getElementById("scene");

    initGL(canvas);
    initShaders();
    initSquareBuffer(0, 0, 0, 1, 1);

    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        render();
    }
}
