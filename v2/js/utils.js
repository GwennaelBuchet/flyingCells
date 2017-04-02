/**
 * Created by gwennael.buchet on 28/03/17.
 */

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;
let isFullScreen = false;
function toggleFullscreen(element, glContext, normalDimension) {

    if (!isFullScreen) {

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }

        glContext.viewportWidth = element.width = window.innerWidth;
        glContext.viewportHeight = element.height = window.innerHeight;

        isFullScreen = true;
    }
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }

        glContext.viewportWidth = element.width = normalDimension.w;
        glContext.viewportHeight = element.height = normalDimension.h;

        isFullScreen = false;
    }
}