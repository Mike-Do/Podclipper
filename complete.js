document.addEventListener('DOMContentLoaded', () => {

  function _audioEncode(arrayBuffer) {
    let u8 = new Uint8Array(arrayBuffer)
    let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer), function (p, c) { return p + String.fromCharCode(c) }, ''))
    let mimetype = "audio/wav"
    return "data:" + mimetype + ";base64," + b64encoded
  }

  function blobToFile(theBlob, fileName) {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  const encodeProgress = document.getElementById('encodeProgress');
  const saveButton = document.getElementById('saveCapture');
  const closeButton = document.getElementById('close');
  const status = document.getElementById('status');
  let format;
  let audioURL;
  let encoding = false;
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "createTab") {
      format = request.format;
      let startID = request.startID;
      status.innerHTML = "Please wait...";
      // status.innerHTML = `${request.startUrl}`;
      // console.log(request)
      // console.log(axios)
      // console.log(window.location.toString());
      closeButton.onclick = () => {
        chrome.runtime.sendMessage({ cancelEncodeID: startID });
        chrome.tabs.getCurrent((tab) => {
          chrome.tabs.remove(tab.id);
        });
      }

      //if the encoding completed before the page has loaded
      if (request.audioURL) {
        encodeProgress.style.width = '100%';
        status.innerHTML = "File is ready!";
        generateSave(request.audioURL);
      } else {
        encoding = true;
      }
    }

    //when encoding completes
    if (request.type === "encodingComplete" && encoding) {
      encoding = false;
      status.innerHTML = "File is ready!";
      encodeProgress.style.width = '100%';
      generateSave(request.audioURL);
    }
    //updates encoding process bar upon messages
    if (request.type === "encodingProgress" && encoding) {
      encodeProgress.style.width = `${request.progress * 100}%`;
    }
    function generateSave(url) { //creates the save button
      const currentDate = new Date(Date.now()).toDateString();
      saveButton.onclick = () => {

        //chrome.downloads.download({url: url, filename: `${currentDate}.${format}`, saveAs: true});
        console.log("URL: ", url)
        $.get(url).then(function (data) {
          var blob = new Blob([data], { type: 'audio/wav' });
          console.log("tried to create the blob", blob)

          // let blobFile = blobToFile(blob, "audio_from_extension.wav")

          // let blobFile = new File([blob], "audio_from_extension.wav", { type: "audio/wav", })

          var formData = new FormData();
          formData.append("file", blobFile);
          formData.append("mongo_id", "5fde50a79f83059f957f781d");
          formData.append("title", "title from extension");
          formData.append("url", "www.spotify.com");
          axios.post('http://localhost:5000/clip', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDg0NDE2OTAsIm5iZiI6MTYwODQ0MTY5MCwianRpIjoiMDE2ZGViYTQtZGIzOC00YmEwLWIxNWUtMDIwN2VmNDJmYzIwIiwiaWRlbnRpdHkiOiJCbHVlbm8iLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.o0R9WfJ6aBDO_v4XzsF4rkyQ1RPVvzahCfoLjI9YXbk`,
            }
          })
            .then(res => {
              console.log("Done sending file to flask")
            })
        });
        // axios.post('#', {

        // })
        // .then(resp => console.log(resp));
      };
      saveButton.style.display = "inline-block";
    }
  });


})
