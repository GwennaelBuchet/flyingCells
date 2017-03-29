/**
 * Created by gwennael.buchet on 28/03/17.
 */

class Square {

    constructor() {
        this.invalidate();
    }

    invalidate() {
        this.x = -10 + Math.random() * 2;
        this.y = -5 + (Math.random() * 10);
        this.z = -12 + (Math.random() * 2);

        this.speed = 0.1 + Math.random();
    }

    animate() {
        this.x += this.speed;

        if (this.x > 10) {
            this.invalidate();
        }
    }

    static createBuffers() {
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        let vertices = [
            1, 1, 0,
            0, 1, 0,
            1, 0, 0,
            0, 0, 0
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

        return [positionBuffer, colorBuffer];
    }

}

