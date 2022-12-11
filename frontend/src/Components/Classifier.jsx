import * as tf from "@tensorflow/tfjs";
import idx2class1 from "./classIdxDict2";
import { loadFull } from "tsparticles";
import Particles from "./Particles.js";

import React, { useState, useEffect } from "react";

const Classifier = () => {
  // usestate for setting a javascript
  // object for storing and using data

  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [topNPredNames, setPrediction] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [model, setModel] = useState(null);
  function readImage(file) {
    return new Promise((rs, rj) => {
      const fileReader = new FileReader();
      fileReader.onload = () => rs(fileReader.result);
      fileReader.onerror = () => rj(fileReader.error);
      fileReader.readAsDataURL(file);
    });
  }

  async function handleImgUpload(event) {
    const {
      target: { files },
    } = event;

    const _file = files[0];
    const fileData = await readImage(_file);
    setFile(fileData);
    setProcessing(true);
  }

  const MODEL_HTTP_URL = "api/classify";
  const MODEL_INDEXEDDB_URL = "indexeddb://pokemon-model";

  const getTopNPred = (pred, k) => {
    const predIdx = [];
    const predNames = [];

    const topnPred = [...pred].sort((a, b) => b - a).slice(0, k);
    console.log(topnPred);
    topnPred.map((i) => predIdx.push(pred.indexOf(i)));
    predIdx.map((i) => predNames.push(idx2class1[i]));
    console.log(predNames);
    var preds = topnPred.reduce(function (result, field, index) {
      result[predNames[index]] = field;
      return result;
    }, {});
    console.log("fuck");

    console.log(preds);
    return preds;
  };

  const getTopNPredPokeObj = (pred, k) => {
    const foundPokeObj = [];
    const predPokeName = getTopNPred(pred, k);
    console.log(predPokeName);
    return predPokeName;
  };
  useEffect(() => {
    async function fetchModel() {
      try {
        const localClassifierModel = await tf.loadLayersModel(
          MODEL_INDEXEDDB_URL
        );

        setModel(localClassifierModel);
        console.log("Model loaded from IndexedDB");
      } catch (e) {
        try {
          const classifierModel = await tf.loadLayersModel(MODEL_HTTP_URL);

          console.log(classifierModel);
          setModel(classifierModel);
          console.log("Model Loaded");
          await classifierModel.save(MODEL_INDEXEDDB_URL);
          console.log("Model saved to IndexedDB");
        } catch (e) {
          console.log("Unable to load model at all: ", e);
        }
      }
    }
    fetchModel();
  }, []);
  useEffect(() => {
    async function predict() {
      if (imageLoaded && file) {
        const imageElement = document.createElement("img");
        imageElement.src = file;

        imageElement.onload = async () => {
          const tensor = tf.browser
            .fromPixels(imageElement)
            .resizeNearestNeighbor([120, 120])
            .toFloat()
            .sub(127)
            .div(127)
            .expandDims();

          const y_pred = await model.predict(tensor).data();

          const topNPredNames = getTopNPredPokeObj(y_pred, 3);

          setPrediction(topNPredNames);
          console.log("-----------");
          setProcessing(false);
          setImageLoaded(false);
          return topNPredNames;
        };
      }
    }

    predict();
  }, [imageLoaded, model, file]);

  return (
    <div className="container">
      <Particles id="tsparticles" />

      <div className="jumbotron">
        <center>
          <form className="Form">
            <label htmlFor="upload-image">
              <h1> Upload image </h1>
            </label>
            <br></br>
            <input
              id="image-selector"
              type="file"
              name="upload-image"
              accept="image/*"
              className="File-selector"
              onChange={handleImgUpload}
              disabled={!model || processing}
            />
          </form>
          <div className="Upload">
            <img
              onLoad={() => {
                setImageLoaded(true);
              }}
              alt=""
              src={file}
            />
          </div>
          <div className="Results">
            {processing ? (
              <p>Loading ...</p>
            ) : topNPredNames !== null ? (
              <div className="row">
                {Object.entries(topNPredNames).map(([key, value]) => (
                  <div className="col-md-4">
                    <h2>{key}</h2> <h2>{value}</h2>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </center>
      </div>
    </div>
  );
};

export default Classifier;
