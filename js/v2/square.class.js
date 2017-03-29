/**
 * Created by gwennael.buchet on 28/03/17.
 */

class Square {

    constructor() {
        this.invalidate();
    }

    invalidate() {
        this.x = -20 + Math.random() * 10;
        this.y = -7 + (Math.random() * 14);
        this.z = -15 + (Math.random() * 7);

        this.speed = 0.05 + Math.random() / 10;
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

