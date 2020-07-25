import React from "react";
import Sketch from "react-p5";

const Rendering = (props) => {
  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL);
    p5.setAttributes(p5.antialias, true);
    p5.frustum(-1.5, 1.5, -0.3, 0.3, 0.5, 1000);
  };

  const draw = (p5) => {
    p5.pointLight(200, 200, 0, -1, 0, 0);
    p5.background(70);
    p5.map();
    p5.rotateX(p5.map(p5.mouseY, 0, p5.height, 0, p5.TWO_PI));
    p5.rotateY(p5.map(p5.mouseX, 0, p5.width, 0, p5.TWO_PI));
    p5.noFill();
    p5.strokeWeight(2);
    p5.stroke(0, 0, 255);
    p5.torus(500, 500);
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default Rendering;
