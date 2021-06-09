import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  SceneLoader,
} from "@babylonjs/core";
import SceneComponent from "./SceneSetup";
import "babylonjs-loaders";
import { OBJFileLoader } from "babylonjs-loaders";
import "./App.css";

const App = () => {
  const [modelReady, setModelReady] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");

  const preview = useRef(null);
  const imgFile = useRef(null);

  useEffect(() => {
    SceneLoader.RegisterPlugin(new OBJFileLoader());
  }, []);

  //Show the image in the preview panel
  const previewImage = () => {
    console.log("User uploaded an image");
    const reader = new FileReader();

    reader.onload = function () {
      preview.current.style.backgroundImage = "url(" + reader.result + ")";
    };
    reader.readAsDataURL(imgFile.current.files[0]);
  };

  //User clicks submit button. Send POST to Flask server with image payload
  const submit = () => {
    console.log("User submitted the image");
    setButtonText("Loading...");
    const file = imgFile.current.files[0];
    if (!file) {
      alert("Please upload a valid file before submitting.");
    } else {
      const formData = new FormData();
      formData.append("image", imgFile.current.files[0]);
      console.log(formData.get("image"));
      axios.post("/imageUpload", formData).then(
        //After image is uploaded, check if model is ready
        axios.get("/modelReady").then((data) => {
          //After model is ready, change flags
          setButtonText("Submit");
          setModelReady(true);
        })
      );
    }
  };

  //-------BABYLON JS-----------

  const onSceneReady = (scene) => {
    // This creates and positions a free camera (non-mesh)
    var camera = new ArcRotateCamera(
      "Camera",
      1,
      1,
      10,
      new Vector3(0, 0, 0),
      scene
    );
    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());
    camera.wheelDeltaPercentage = 0.01;
    const canvas = scene.getEngine().getRenderingCanvas();
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    // Load model
    
    SceneLoader.Append(
      "http://localhost:5000/get_model/",
      "test.obj",
      scene,
      function (scene) {
        console.log("Mesh loaded");
      }
    );
  };

  return (
    <main className="App">
      <h1>3D Surface Modeling Prediction using 2D Sketch</h1>
      <h2>Group R37 - Final Year Project</h2>
      <hr />
      <p>
        The aim of this project is to create a 3D surface mesh from a shaded 2D
        sketch, provided as an image file by the user.
      </p>
      <div className="image-upload">
        <div className="image-preview" ref={preview}></div>
        <div className="upload-options">
          <label className="btn">
            +
            <input
              type="file"
              accept="image/*"
              ref={imgFile}
              required
              onChange={() => previewImage()}
            />
          </label>
        </div>
      </div>
      <button className="btn" onClick={() => submit()}>
        {buttonText}
      </button>
      {modelReady && (
        <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas" />
      )}
    </main>
  );
};

export default App;
