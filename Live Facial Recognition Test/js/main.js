//import '@tensorflow/tfjs-node';
//import * as canvas from 'canvas';
//import * as faceapi from 'face-api.js'; 

const video = document.getElementById('video')
//const picture = document.getElementById('myFace')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('\models'),
    faceapi.nets.ageGenderNet.loadFromUri('\models'),
    faceapi.nets.faceExpressionNet.loadFromUri('\models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('\models'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('\models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('\models'),
    faceapi.nets.mtcnn.loadFromUri('\models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('\models')
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
    console.log(faceapi.nets)
}

async function getImages() {
    const results = await faceapi
        .detectAllFaces(referenceImage)
        .withFaceLandmarks()
        .withFaceDescriptors()
}

video.addEventListener('play', () => {
    //const canvas = faceapi.createCanvasFromMedia(video)
    //document.body.append(canvas)
    const canvas = document.getElementById('overlay')
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})

/*async function pictureDetect() {
    const canvas = document.getElementById('overlay')
    const pictureSize = { width: picture.width, height: picture.height }
    faceapi.matchDimensions(canvas, pictureSize)
    const detections = await faceapi.detectAllFaces(picture, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
    console.log(detections)
    const resizedDetections = faceapi.resizeResults(detections, pictureSize)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    faceapi.draw.drawAgeAndGender(canvas, resizedDetections)
}*/

