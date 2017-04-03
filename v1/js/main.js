let gl;
let canvas;
let canvasDimension = {};

let shaderProgram;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();

let squares = [];
let _NB_SQUARES = 300;
let deltaZ = 0.4;
//buffers
let squareVertexPositionBuffer = null;
let squareVertexColorBuffer = null;
let texture = null;

let isAnimated = true;
let renderingModes = null;
let backgroundColor = 0.0;

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

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
}

function handleLoadedTexture(t) {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
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
        mat4.multiply(mvMatrix, mvMatrix, sceneRotationMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, square.textureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, square.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

        gl.drawArrays(renderingModes, 0, squareVertexPositionBuffer.numItems);
    }
}

function animateSquares() {
    for (let i = 0; i < _NB_SQUARES; i++) {
        squares[i].animate(deltaZ);
    }
}

function initSquares() {
    //Let's define only 1 buffer th at will be used to render several squares.
    //That way we'll use less memory
    let buffers = Square.createBuffers();
    squareVertexPositionBuffer = buffers[0];
    squareVertexColorBuffer = buffers[1];

    for (let i = 0; i < _NB_SQUARES; i++) {
        squares.push(new Square(deltaZ));
    }
}

/**
 * Main rendering loop
 */
function render() {
    requestAnimFrame(render);

    gl.clearColor(backgroundColor, backgroundColor, backgroundColor, 1.0);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

    renderSquares();

    if (isAnimated) {

        if (backgroundColor < 1.0)
            backgroundColor += 0.005;

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
            case "Enter" :
                mat4.identity(sceneRotationMatrix);
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

        event.preventDefault();
    }, true);
}

let mouseDown = false;
let lastMouseX = null;
let lastMouseY = null;
let sceneRotationMatrix = mat4.create();
function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }
    let newX = event.clientX;
    let newY = event.clientY;

    let deltaX = newX - lastMouseX;
    let newRotationMatrix = mat4.create();
    mat4.identity(newRotationMatrix);
    mat4.rotate(newRotationMatrix, newRotationMatrix, degToRad(deltaX / 10), vec3.fromValues(0, 1, 0));

    let deltaY = newY - lastMouseY;
    mat4.rotate(newRotationMatrix, newRotationMatrix, degToRad(deltaY / 10), vec3.fromValues(1, 0, 0));

    mat4.multiply(sceneRotationMatrix, newRotationMatrix, sceneRotationMatrix);

    lastMouseX = newX;
    lastMouseY = newY;
}

function initMouse() {
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
}

/**
 * Entry point for our application
 */
function main() {
    const canvas = document.getElementById("scene");

    initGL(canvas);
    initShaders();
    renderingModes = gl.TRIANGLE_STRIP;

    initKeyboard();
    initMouse();

    initTexture();
    initSquares();

    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        render();
    }
}
