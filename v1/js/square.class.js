/**
 * Created by gwennael.buchet on 28/03/17.
 */
const squareWidth = 1.6;

class Square {

    constructor(deltaZ) {
        //compute new tex coords
        this.textureCoords = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];

        this.textureCoordBuffer = gl.createBuffer();
        this.textureCoordBuffer.itemSize = 2;
        this.textureCoordBuffer.numItems = 4;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);

        this.invalidate(deltaZ);
    }

    invalidate(deltaZ) {
        //set a random new position to the left out of the screen
        this.x = -25 + Math.random() * 17;
        this.y = -3 + (Math.random() * 6);
        this.z = -8 + (Math.random() * deltaZ);

        //new animation speed
        this.speed = 0.01 + Math.random() / 8;

    }

    animate(deltaZ) {
        this.x += this.speed;

        if (this.x > 10) {
            this.invalidate(deltaZ);
        }

        let screenWidth = 14;
        let screenHeight = 10;
        let halfScreenWidth = screenWidth / 2;
        let halfScreenHeight = screenHeight / 2;

        //compute the new texture coordinates, depending on the position on the screen
        let texWidth = squareWidth / screenWidth;
        let texHeight = squareWidth / screenHeight;
        let texX = (this.x + halfScreenWidth) / screenWidth;
        let texY = 1.0 - ((this.y + halfScreenHeight) / screenHeight);
        this.textureCoords = [
            texX + texWidth, texY,
            texX, texY,
            texX + texWidth, texY + texHeight,
            texX, texY + texHeight
            /*1.0, 0.0,
             0.0, 0.0,
             1.0, 1.0,
             0.0, 1.0*/
        ];


        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);
    }

    static createBuffers() {
        let hw = squareWidth / 2;
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

        return [positionBuffer, colorBuffer];
    }

}

