import React from "react";
import Sketch from "react-p5";

const Rendering = (props) => {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL);
    p5.setAttributes(p5.antialias, true);
    p5.frustum(-1, 3, -0.3, 0.9, 0.2, 1000);
    p5.pointLight(200, 200, 0, -1, 0, 0);

    /*p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL);
    p5.setAttributes(p5.antialias, true);
    p5.frustum(-1.5, 0.5, -0.3, 0.3, 0.2, 1000);
    p5.pointLight(200, 200, 0, -1, 0, 0);
    p5.rotateX(1300);
    p5.rotateY(100);
    p5.normalMaterial();
    p5.torus(200, 500);*/
  };

  const draw = (p5) => {
    p5.clear();
    p5.rotateX(p5.map(p5.mouseY, 0, p5.height * 3, 0, p5.TWO_PI));
    p5.rotateY(p5.map(p5.mouseX, 0, p5.width * 3, 0, p5.TWO_PI));
    //p5.rotateX(1300);
    //p5.rotateY(100);
    p5.rotateZ(1000);
    p5.noFill();
    p5.strokeWeight(2);
    p5.stroke(0, 0, 255);
    p5.torus(500, 500);
    p5.stroke(255, 0, 0);
    p5.normalMaterial();
    p5.box(130, 600);
    p5.noFill();
    p5.stroke(0, 255, 0);
    p5.cone(800, 620);
    p5.stroke(255, 0, 0);
    p5.torus(700, 500);
    p5.normalMaterial();
    p5.torus(900, 150);
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default Rendering;
