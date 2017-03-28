/**
 * Created by gwennael.buchet on 28/03/17.
 */

let gl;

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

}

/**
 * Initialize mesh with vertex buffer objects
 */
function initBuffers() {

}

/**
 * Rendering loop
 */
function render() {

}