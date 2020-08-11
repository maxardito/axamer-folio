import React from "react";
import Sketch from "react-p5";

const Rendering = (props) => {
  const setup = (p5, canvasParentRef) => {

    p5.createCanvas(200, 150, p5.WEBGL).parent(canvasParentRef);
    p5.setAttributes(p5.antialias, true);
    p5.pointLight(200, 200, 0, -1, 0, 0);
    p5.rotateX(200);
    p5.rotateY(100);
    p5.normalMaterial();
    p5.box(90, 90);
  };

  const draw = (p5) => {
    p5.clear();
    p5.rotateX(p5.map(p5.mouseY, 0, p5.height * 10, 0, p5.TWO_PI));
    p5.rotateY(p5.map(p5.mouseX, 0, p5.width * 10, 0, p5.TWO_PI));
    p5.box(90, 90);

  };

  return (
    <Sketch setup={setup} draw={draw} />
  );
};

export default Rendering;
