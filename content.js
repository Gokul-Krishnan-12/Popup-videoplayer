setTimeout(function () {
  // Function to apply the content script to a single video element
  function addButton(video, fileId) {
    const button = document.createElement("button");
    button.style.position = "absolute";
    button.style.zIndex = "9";
    button.style.left = "-32px";
    button.style.top = "25%";
    button.style.borderRadius = "50%";
    button.style.backgroundImage = `url(${chrome.runtime.getURL(
      "assets/play.png"
    )})`;
    button.style.backgroundSize = "cover";
    button.style.width = "20px";
    button.style.height = "20px";
    button.style.border = "none";

    video.parentNode.style.position = "relative";
    video.parentNode.parentNode.appendChild(button);

    button.onclick = function () {
      const popup = document.createElement("div");
      popup.style.position = "fixed";
      popup.style.top = "50%";
      popup.style.left = "50%";
      popup.style.transform = "translate(-50%, -60%)";
      popup.style.zIndex = "9999";
      popup.style.backgroundColor = "#fff";
      popup.style.borderRadius = "5px";
      popup.style.padding = "20px";
      popup.style.width = "50vw";
      popup.style.height = "60vh";

      const videoElement = document.createElement("video");
      videoElement.classList.add("video-js");
      videoElement.classList.add("vjs-default-skin");
      videoElement.style.position = "absolute";
      videoElement.style.width = "100%";
      videoElement.style.height = "100%";
      videoElement.style.objectFit = "contain";
      videoElement.style.background = "#262626";
      videoElement.controls = true;
      videoElement.autoplay = true;

      const source = document.createElement("source");
      source.src = `https://portal.whiterabbit.group/?action=viewFile&fileId=${fileId}&v=1&display=true`;
      source.type = "video/mp4";

      videoElement.appendChild(source);
      popup.appendChild(videoElement);

      const closeButton = document.createElement("button");
      closeButton.textContent = "\u00D7";
      closeButton.style.position = "absolute";
      closeButton.style.fontSize = "xx-large";
      closeButton.style.fontWeight = "500";
      closeButton.style.right = "-20px";
      closeButton.style.top = "-30px";

      closeButton.onclick = function () {
        document.body.removeChild(popup);
      };
      popup.appendChild(closeButton);

      // Speed Control Dropdown
      const speedDropdown = document.createElement("select");
      speedDropdown.style.position = "absolute";
      speedDropdown.style.bottom = "2.5%";
      speedDropdown.style.right = "27%";
      speedDropdown.style.padding = "5px";
      speedDropdown.style.fontSize = "14px";
      speedDropdown.style.border = "none";
      speedDropdown.style.color = "white";

      // Add event listener to change the background color on hover
      speedDropdown.addEventListener("mouseenter", function () {
        this.style.backgroundColor = "#343537";
        this.style.borderRadius = "90%";
      });

      // Add event listener to change the background color back to black when not hovering
      speedDropdown.addEventListener("mouseleave", function () {
        this.style.backgroundColor = "";
      });

      const speeds = [1, 1.5, 2]; // Available playback speeds
      speeds.forEach(function (speed) {
        const option = document.createElement("option");
        option.value = speed;
        option.textContent = `${speed}x`;
        speedDropdown.appendChild(option);
      });

      // Change playback speed on selection change
      speedDropdown.onchange = function () {
        const selectedSpeed = this.value;
        videoElement.playbackRate = selectedSpeed;
      };

      popup.appendChild(speedDropdown);

      document.body.appendChild(popup);
    };
  }

  // Function to apply the content script to all video elements on the page
  function addButtons() {
    //getting the iframe details
    const iframes = document.getElementsByClassName(
      "tw-legacyViewWrapper normal"
    );
    for (const iframe of iframes) {
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;

      const attachments = iframeDocument.getElementsByClassName(
        "w-attachment-list__body"
      );
      for (const attachment of attachments) {
        attachment.style.flexDirection = "column";
      }

      // selecting videos only by finding play button icon
      const videoTags = iframeDocument.getElementsByClassName("is-icon");
      for (const video of videoTags) {
        //getting the url of the closest link
        const linkElement = video.closest("a.image");
        if (linkElement) {
          const href = linkElement.getAttribute("href");
          const fileId = href.split("fileId=")[1].split("&")[0];
          addButton(video, fileId);
        }
      }

      const commentAttachments = iframeDocument.getElementsByClassName(
        "w-attachment__preview"
      );
      for (const attachment of commentAttachments) {
        const linkElement = attachment.closest("a");

        const backgroundImageUrl = attachment.style.backgroundImage;
        const videoUrlRegex = /url\(".*\/video\.png"\)/;
        let isVideoAvailable = videoUrlRegex.test(backgroundImageUrl);

        if (linkElement && isVideoAvailable) {
          const href = linkElement.getAttribute("href");
          const fileId = href.split("fileId=")[1].split("&")[0];
          addButton(attachment, fileId);
        }
      }
    }
  }

  // Apply the content script to the existing video elements on the page
  addButtons();
}, 5000);
