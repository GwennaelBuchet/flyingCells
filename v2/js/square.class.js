/**
 * Created by gwennael.buchet on 28/03/17.
 */
const squareWidth = 0.6;
const screenWidth = 16;
const screenHeight = 12;
const halfScreenWidth = screenWidth / 2.0;
const halfScreenHeight = screenHeight / 2.0;
const nbColumns = Math.floor((screenWidth / squareWidth));
const nbRows = Math.floor((screenHeight / squareWidth));
const nbSquares = nbColumns * nbRows;

class Square {

    constructor(index, deltaZ) {

        //compute position of this swuare on the "wall of square", which is a matrix
        this.row = Math.floor(index / nbColumns);
        this.column = index - (this.row * nbColumns);

        this.x = -halfScreenWidth + (this.column * squareWidth + 0.2);
        this.y = -halfScreenHeight + (this.row * squareWidth + 0.2);
        this.z = -8 + (Math.random() * deltaZ);

        //compute tex coords
        this.textureCoordBuffer = gl.createBuffer();
        this.textureCoordBuffer.itemSize = 2;
        this.textureCoordBuffer.numItems = 4;
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

        this.invalidate(deltaZ);
    }

    invalidate(deltaZ) {

        this.z = -8 + (Math.random() * deltaZ);

        //new animation speed
        this.speed = 0.005 + Math.random() / 100;
        this.alpha = 0.0;
        this.tmpAlpha = 0.0;

        //this.tmpJump = 0;
    }

    animate(deltaZ) {
        this.tmpAlpha += this.speed;
        this.alpha = Math.sin(this.tmpAlpha);

        //this.tmpJump += 0.001;
        //this.z = -8 + (Math.sin((this.row * Math.PI / nbRows) * this.tmpJump) / 10.0);

        if (this.tmpAlpha > Math.PI) {
            this.invalidate(deltaZ);
        }
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

        return positionBuffer;
    }

}

