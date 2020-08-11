//import '@tensorflow/tfjs-node';
//import * as canvas from 'canvas';
//import * as faceapi from 'face-api.js'; 

const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('\models'),
    faceapi.nets.ageGenderNet.loadFromUri('\models'),
    faceapi.nets.faceExpressionNet.loadFromUri('\models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('\models'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('\models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('\models'),
    faceapi.nets.mtcnn.loadFromUri('\models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('\models')
]).then(getImages)
  .then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
    console.log(faceapi.nets)
}

function getImages() {
    const labels = ['Calvin_Dong', 'Bernie_Sanders']
    return Promise.all( //Promises to return an array of all promised values
        labels.map(async label => {
            const descriptions = [] //Array of face information to be pushed to LabeledFaceDescriptors
            const img = await faceapi.fetchImage('https://raw.githubusercontent.com/CalvinDong/FacialRecognitionTest/master/Live%20Facial%20Recognition%20Test/training/' + label + '.jpg')
            const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()
            descriptions.push(detections.descriptor) //Add information of person's face to descriptions array (there can be multiple of the same person)
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}

// Recognise certain faces
video.addEventListener('play', async () => {
    const canvas = document.getElementById('overlay')
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    const labeledDescriptors = await getImages() // This is an array of arrays. The Arrays are hold each labeled face descriptor
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, .6)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        console.log(resizedDetections)
        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            drawBox.draw(canvas)
        })
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    }, 100)
})


/*
//Recognising what's a face
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
        console.log(resizedDetections)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})
*/

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

