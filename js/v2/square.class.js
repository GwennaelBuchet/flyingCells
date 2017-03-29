/**
 * Created by gwennael.buchet on 28/03/17.
 */

class Square {

    constructor() {
        this.invalidate();
    }

    invalidate() {
        this.x = -40 + Math.random() * 17;
        this.y = -5 + (Math.random() * 10);
        this.z = -15 + (Math.random() * 7);

        this.speed = 0.05 + Math.random() / 10;
    }

    animate() {
        this.x += this.speed;

        if (this.x > 13) {
            this.invalidate();
        }
    }

    static createBuffers() {
        let hw = 0.8;
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        let vertices = [
            hw, hw, 0.0,
            -hw, hw, 0.0,
            hw, -hw, 0.0,
            -hw, -hw, 0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        positionBuffer.itemSize = 3;
        positionBuffer.numItems = 4;


        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        let colors = [
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        colorBuffer.itemSize = 4;
        colorBuffer.numItems = 4;

        let textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        let textureCoords = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        textureCoordBuffer.itemSize = 2;
        textureCoordBuffer.numItems = 4;

        return [positionBuffer, colorBuffer, textureCoordBuffer];
    }

}

