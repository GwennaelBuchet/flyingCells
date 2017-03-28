/**
 * Created by gwennael.buchet on 28/03/17.
 */

let gl;
let squareVerticesBuffer;

/**
 * Entry point of our program
 */
function main() {

    const canvas = document.getElementById("scene");

    initGL(canvas);
    initShaders();
    initBuffers();

    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        render();
    }
}

/**
 * Initialize the GL context
 * @param canvas
 */
function initGL(canvas) {
    gl = null;

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialize WegGL. Maybe your browser does not support this feature :'(");
    }
}

/**
 * Initialize all shaders
 */
function initShaders() {
    let fs_monochrome = _getShader(gl, "fs-monochrome");
    let vs_simple = _getShader(gl, "vs-simple");

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vs_simple);
    gl.attachShader(shaderProgram, fs_monochrome);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize shaders.");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function _getShader(gl, id) {
    let shaderScript, shaderSource, currentChild, shader;

    shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    shaderSource = "";
    currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType === currentChild.TEXT_NODE) {
            shaderSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

    if (shaderScript.type === "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type === "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        // type de shader inconnu
        return null;
    }

    gl.shaderSource(shader, shaderSource);

    // Compile le programme shader
    gl.compileShader(shader);

    // Vérifie si la compilation s'est bien déroulée
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Une erreur est survenue au cours de la compilation des shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

/**
 * Initialize mesh with vertex buffer objects
 */
function initBuffers() {
    squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

    const vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVerticesBuffer.itemSize = 3;
    squareVerticesBuffer.numItems = 4;
}

/**
 * Rendering loop
 */
function render() {
}