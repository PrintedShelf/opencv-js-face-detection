const utils = new Utils('errorMessage');
const imageUsed = document.getElementById('sample').getAttribute('src')
console.log(imageUsed)
const applyButton = document.getElementById('apply')

const setUpApplyButton = function () {
    utils.loadImageToCanvas(imageUsed, 'imageInit')
    let faceCascadeFile = 'haarcascade_frontalface_default.xml';
    utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, async () => {
        console.log('cascade ready to load.');
        let src = cv.imread('imageInit');
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        let faces = new cv.RectVector();
        let faceCascade = new cv.CascadeClassifier();
        faceCascade.load(faceCascadeFile);
        let count = 0
        setInterval(function(){
                count+=1;
                console.log(count)
                faceCascade.detectMultiScale(gray, faces, 1.3, 5);
                console.dir(faceCascadeFile)
                console.log('Faces :' + faces.size())
                if (faces.size()>0) {
                    console.log('face detected')
                }
                for (let i = 0; i < faces.size(); ++i) {
                    console.log(faces)
                    let roiGray = gray.roi(faces.get(i));
                    let roiSrc = src.roi(faces.get(i));
                    let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
                    let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
                                            faces.get(i).y + faces.get(i).height);
                    cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
                    roiGray.delete(); roiSrc.delete();
                }
                cv.imshow('imageResult', src);
            },1000) 
        // src.delete(); gray.delete(); faceCascade.delete();
        document.getElementById('imageInit').style.display = "none"
    });
}
applyButton.setAttribute('disabled','true')
applyButton.onclick = setUpApplyButton
utils.loadOpenCv(() => {
    setTimeout(function () { 
        applyButton.removeAttribute('disabled');
    },500)
});
