// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const videoCardContainer = document.querySelector(".video_wrapper");

    let api_key = "AIzaSyDGZlffLHMMOwslnmupbjXKxixpHHE7QZ4";
    let video_http = "https://www.googleapis.com/youtube/v3/videos?";
    let channel_http = "https://www.googleapis.com/youtube/v3/channels?";

    fetch(
        video_http +
        new URLSearchParams({
            part: "snippet,contentDetails,statistics,player",
            chart: "mostPopular",
            maxResults: 40,
            regionCode: "IN",
            key: api_key,
        })
    )
        .then((res) => res.json())
        .then((data) => {
            console.log("Video Data:", data);
            data.items.forEach((item) => {
                getChannelIcon(item);
            });
        })
        .catch((err) => console.log(err));

    const getChannelIcon = (video_data) => {
        fetch(
            channel_http +
            new URLSearchParams({
                key: api_key,
                part: "snippet",
                id: video_data.snippet.channelId,
            })
        )
            .then((res) => res.json())
            .then((data) => {
                console.log("Channel Data:", data);
                video_data.channelThumbnail =
                    data.items[0].snippet.thumbnails.default.url;
                makeVideoCard(video_data);
            })
            .catch((error) => {
                console.error("Error fetching channel data:", error);
            });
    };

    const playVideo = (embedHtml) => {
        sessionStorage.setItem("videoEmbedHtml", embedHtml);

        window.location.href = "video-page.html"
    }

    const makeVideoCard = (data) => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video");
        videoCard.innerHTML = `
        <div class="video-content">
            <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="" />
        </div>
        <div class="video-details">
            <div class="channel-logo">
                <img src="${data.channelThumbnail}" alt="" class="channel-icon" />
            </div>
            <div class="detail">
                <h3 class="title">${data.snippet.title}</h3>
                <div class="channel-name">${data.snippet.channelTitle}</div>
            </div>
        </div>
    `;

    videoCard.addEventListener("click", ()=>{
        playVideo(data.player.embedHtml);
    });
        videoCardContainer.appendChild(videoCard);
    };
});
