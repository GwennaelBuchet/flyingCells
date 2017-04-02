let gl;
let canvas;
let canvasDimension = {};

let shaderProgram;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();

let squares = [];
let deltaZ = 0.1;
//buffers
let squareVertexPositionBuffer = null;
let texture = null;

let isAnimated = true;
let renderingModes = null;

function initGL(canvasElt) {
    try {
        gl = canvasElt.getContext("webgl") || canvasElt.getContext("experimental-webgl");
        gl.viewportWidth = canvasElt.width;
        gl.viewportHeight = canvasElt.height;
        canvasDimension.w = canvasElt.width;
        canvasDimension.h = canvasElt.height;
        canvas = canvasElt;
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
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.alphaUniform = gl.getUniformLocation(shaderProgram, "uAlpha");
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
}

function handleLoadedTexture(t) {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTexture() {
    texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function () {
        handleLoadedTexture(texture)
    };

    texture.image.src = "../img/zenika_1.jpg";
}

function renderSquares() {

    let square = null;
    for (let i = 0, len = squares.length; i < len; i++) {

        square = squares[i];

        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(square.x, square.y, square.z));


        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, square.textureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, square.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniform1f(shaderProgram.alphaUniform, square.alpha);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

        gl.drawArrays(renderingModes, 0, squareVertexPositionBuffer.numItems);
    }
}

function animateSquares() {
    for (let i = 0; i < nbSquares; i++) {
        squares[i].animate(deltaZ);
    }
}

function initSquares() {
    //Let's define only 1 buffer th at will be used to render several squares.
    //That way we'll use less memory
    squareVertexPositionBuffer = Square.createBuffers();

    for (let i = 0; i < nbSquares; i++) {
        squares.push(new Square(i, deltaZ));
    }
}

/**
 * Main rendering loop
 */
function render() {
    requestAnimFrame(render);

    //gl.clearColor(1, 1, 1, 1);
    //gl.colorMask(false, false, false, true);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);


    renderSquares();

    if (isAnimated) {
        animateSquares();
    }
}

function initKeyboard() {
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        switch (event.key) {
            case " " :
                isAnimated = !isAnimated;
                break;
            case "w" :
                renderingModes = gl.LINES;
                break;
            case "t" :
                renderingModes = gl.TRIANGLE_STRIP;
                break;
            case "f":
                toggleFullscreen(canvas, gl, canvasDimension);
                break;
            case "-":
            case "ArrowDown":
            case "ArrowLeft":
                deltaZ = Math.max(0, deltaZ - 0.1);
                break;
            case "ArrowUp":
            case "+":
            case "ArrowRight":
                deltaZ = Math.min(1.5, deltaZ + 0.1);
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        console.log("deltaZ = " + deltaZ);

        event.preventDefault();
    }, true);
}

/**
 * Entry point for our application
 */
function main() {
    const canvas = document.getElementById("scene");

    initKeyboard();

    initGL(canvas);
    initShaders();
    renderingModes = gl.TRIANGLE_STRIP;

    initTexture();
    initSquares();

    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);

        render();
    }
}
