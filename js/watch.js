// ==========================================
// Bot Pro Watch Page JS
// Firebase Like + Save + Comments
// ==========================================


// ==========================================
// Backend API
// ==========================================

import {
    apiFetch,
    waitForAuth
} from "../firebase/api.js";

const API_URL =
    "https://bot-pro-backend-production.up.railway.app";


// ==========================================
// Current User
// ==========================================

/*
   Temporary user ID.

   Later, when login/authentication is ready,
   this can be replaced with the real Firebase
   authenticated user ID.
*/

let USER_ID =
    localStorage.getItem(
        "botpro_user_id"
    ) ||
    "user_" +
    Math.random()
        .toString(36)
        .substring(2, 12);


localStorage.setItem(
    "botpro_user_id",
    USER_ID
);


const USER_NAME =
    localStorage.getItem(
        "botpro_user_name"
    ) ||
    "You";


// ==========================================
// Elements
// ==========================================

const backBtn =
    document.getElementById(
        "backBtn"
    );


const moreBtn =
    document.getElementById(
        "moreBtn"
    );


const moreMenu =
    document.getElementById(
        "moreMenu"
    );


const watchVideo =
    document.getElementById(
        "watchVideo"
    );


const videoLoading =
    document.getElementById(
        "videoLoading"
    );


const videoError =
    document.getElementById(
        "videoError"
    );


const videoTitle =
    document.getElementById(
        "videoTitle"
    );


const channelName =
    document.getElementById(
        "channelName"
    );


const channelAvatar =
    document.getElementById(
        "channelAvatar"
    );


const uploadTime =
    document.getElementById(
        "uploadTime"
    );


const videoUploaded =
    document.getElementById(
        "videoUploaded"
    );


const videoViews =
    document.getElementById(
        "videoViews"
    );


const likeBtn =
    document.getElementById(
        "likeBtn"
    );


const commentBtn =
    document.getElementById(
        "commentBtn"
    );


const shareBtn =
    document.getElementById(
        "shareBtn"
    );


const saveBtn =
    document.getElementById(
        "saveBtn"
    );


const commentInput =
    document.getElementById(
        "commentInput"
    );


const sendCommentBtn =
    document.getElementById(
        "sendCommentBtn"
    );


const commentsList =
    document.getElementById(
        "commentsList"
    );


const commentCount =
    document.getElementById(
        "commentCount"
    );


const commentsSection =
    document.getElementById(
        "commentsSection"
    );


const toast =
    document.getElementById(
        "toast"
    );


const copyLinkBtn =
    document.getElementById(
        "copyLinkBtn"
    );


const reportBtn =
    document.getElementById(
        "reportBtn"
    );


// ==========================================
// Current Video
// ==========================================

let currentVideo =
    null;


let currentComments =
    [];


// ==========================================
// Video ID
// ==========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const videoId =
    params.get("id");


// ==========================================
// Toast
// ==========================================

function showToast(
    message
) {

    if (!toast) {

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.botProToastTimer
    );


    window.botProToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


// ==========================================
// Format Time
// ==========================================

function formatTime(
    timestamp
) {

    if (!timestamp) {

        return "Just now";

    }


    const difference =
        Date.now() -
        Number(timestamp);


    const seconds =
        Math.floor(
            difference / 1000
        );


    if (seconds < 60) {

        return "Just now";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (minutes < 60) {

        return (

            minutes +

            (
                minutes === 1
                    ? " minute ago"
                    : " minutes ago"
            )

        );

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return (

            hours +

            (
                hours === 1
                    ? " hour ago"
                    : " hours ago"
            )

        );

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days < 30) {

        return (

            days +

            (
                days === 1
                    ? " day ago"
                    : " days ago"
            )

        );

    }


    return "Recently";

}


// ==========================================
// Load Video
// ==========================================

async function loadVideo() {

    if (!videoId) {

        showVideoError(
            "Video not found."
        );

        return;

    }


    try {

        if (videoLoading) {

            videoLoading.classList.remove(
                "hidden"
            );

        }


        const result =
            await apiFetch(
                "/api/upload/posts",
                {
                    method:
                        "GET"
                }
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                result?.error ||
                "Unable to load videos"
            );

        }


        const posts =
            Array.isArray(
                result.posts
            )
                ? result.posts
                : [];


        currentVideo =
            posts.find(
                (post) =>
                    String(post.id) ===
                    String(videoId)
            );


        if (!currentVideo) {

            showVideoError(
                "Video not found."
            );

            return;

        }


        // ==================================
        // Video
        // ==================================

        if (watchVideo) {

            watchVideo.src =
                currentVideo.url;

            watchVideo.load();

        }


        // ==================================
        // Title
        // ==================================

        if (videoTitle) {

            videoTitle.textContent =
                currentVideo.caption ||
                "Uploaded Video";

        }


        // ==================================
        // Channel
        // ==================================

        const creatorName =
            currentVideo.channelName ||
            "Bot Pro";


        if (channelName) {

            channelName.textContent =
                creatorName;

        }


        if (channelAvatar) {

            channelAvatar.textContent =
                creatorName
                    .charAt(0)
                    .toUpperCase();

        }


        // ==================================
        // Upload Time
        // ==================================

        const time =
            formatTime(
                currentVideo.createdAt
            );


        if (uploadTime) {

            uploadTime.textContent =
                time;

        }


        if (videoUploaded) {

            videoUploaded.textContent =
                time;

        }


        // ==================================
        // Views
        // ==================================

        const views =
            Number(
                currentVideo.views || 0
            );


        if (videoViews) {

            videoViews.textContent =
                views +
                " views";

        }


        if (videoLoading) {

            videoLoading.classList.add(
                "hidden"
            );

        }


        // ==================================
        // Load Firebase State
        // ==================================

        await loadLikeState();

        await loadSaveState();

        await loadComments();

    }

    catch (error) {

        console.error(
            "Watch Page Error:",
            error
        );


        showVideoError(
            "Unable to load this video."
        );

    }

}


// ==========================================
// Video Error
// ==========================================

function showVideoError(
    message
) {

    if (videoLoading) {

        videoLoading.classList.add(
            "hidden"
        );

    }


    if (videoError) {

        videoError.textContent =
            message;

        videoError.classList.remove(
            "hidden"
        );

    }

}
// ==========================================
// LIKE STATE
// ==========================================

async function loadLikeState() {

    if (
        !currentVideo ||
        !likeBtn
    ) {

        return;

    }


    const likes =
        currentVideo.likes || {};


    const liked =
        Object.prototype.hasOwnProperty.call(
            likes,
            USER_ID
        );


    likeBtn.classList.toggle(
        "active",
        liked
    );


    const likeCount =
        Object.keys(
            likes
        ).length;


    const likeCountElement =
        document.getElementById(
            "likeCount"
        );


    if (likeCountElement) {

        likeCountElement.textContent =
            likeCount;

    }

}


// ==========================================
// SAVE STATE
// ==========================================

async function loadSaveState() {

    if (
        !currentVideo ||
        !saveBtn
    ) {

        return;

    }


    const saves =
        currentVideo.saves || {};


    const saved =
        Object.prototype.hasOwnProperty.call(
            saves,
            USER_ID
        );


    saveBtn.classList.toggle(
        "active",
        saved
    );

}


// ==========================================
// LIKE / UNLIKE
// ==========================================

async function toggleLike() {

    if (!currentVideo) {

        return;

    }


    try {

        if (likeBtn) {

            likeBtn.disabled =
                true;

        }


        const result =
            await apiFetch(
                "/api/upload/like/" +
                encodeURIComponent(
                    currentVideo.id
                ),
                {

                    method:
                        "POST",

                    body:
                        JSON.stringify({

                            userId:
                                USER_ID

                        })

                }
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Unable to like video"
            );

        }


        if (likeBtn) {

            likeBtn.classList.toggle(
                "active",
                Boolean(
                    result.liked
                )
            );

        }


        const likeCountElement =
            document.getElementById(
                "likeCount"
            );


        if (likeCountElement) {

            likeCountElement.textContent =
                result.likeCount ??
                0;

        }


        showToast(
            result.liked
                ? "Liked"
                : "Like removed"
        );

    }

    catch (error) {

        console.error(
            "Like Error:",
            error
        );


        showToast(
            "Unable to update like"
        );

    }

    finally {

        if (likeBtn) {

            likeBtn.disabled =
                false;

        }

    }

}


// ==========================================
// SAVE / UNSAVE
// ==========================================

async function toggleSave() {

    if (!currentVideo) {

        return;

    }


    try {

        if (saveBtn) {

            saveBtn.disabled =
                true;

        }


        const result =
            await apiFetch(
                "/api/upload/save/" +
                encodeURIComponent(
                    currentVideo.id
                ),
                {

                    method:
                        "POST",

                    body:
                        JSON.stringify({

                            userId:
                                USER_ID

                        })

                }
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Unable to save video"
            );

        }


        if (saveBtn) {

            saveBtn.classList.toggle(
                "active",
                Boolean(
                    result.saved
                )
            );

        }


        showToast(
            result.saved
                ? "Video saved"
                : "Video removed from saved"
        );

    }

    catch (error) {

        console.error(
            "Save Error:",
            error
        );


        showToast(
            "Unable to save video"
        );

    }

    finally {

        if (saveBtn) {

            saveBtn.disabled =
                false;

        }

    }

}


// ==========================================
// LOAD COMMENTS
// ==========================================

async function loadComments() {

    if (!currentVideo) {

        return;

    }


    try {

        const result =
            await apiFetch(
                "/api/upload/comment/" +
                encodeURIComponent(
                    currentVideo.id
                ),
                {

                    method:
                        "GET"

                }
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Unable to load comments"
            );

        }


        currentComments =
            Array.isArray(
                result.comments
            )
                ? result.comments
                : [];


        renderComments();

    }

    catch (error) {

        console.error(
            "Comments Load Error:",
            error
        );


        currentComments =
            [];


        renderComments();

    }

}


// ==========================================
// RENDER COMMENTS
// ==========================================

function renderComments() {

    if (!commentsList) {

        return;

    }


    commentsList.innerHTML =
        "";


    if (commentCount) {

        commentCount.textContent =
            currentComments.length;

    }


    if (
        currentComments.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "no-comments";


        empty.textContent =
            "No comments yet. Be the first to comment.";


        commentsList.appendChild(
            empty
        );


        return;

    }


    currentComments.forEach(
        (comment) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "comment-item";


            const avatar =
                document.createElement(
                    "div"
                );


            avatar.className =
                "comment-avatar";


            const name =
                comment.userName ||
                "User";


            avatar.textContent =
                name
                    .charAt(0)
                    .toUpperCase();


            const content =
                document.createElement(
                    "div"
                );


            content.className =
                "comment-content";


            const author =
                document.createElement(
                    "strong"
                );


            author.textContent =
                name;


            const text =
                document.createElement(
                    "p"
                );


            text.textContent =
                comment.text ||
                "";


            const time =
                document.createElement(
                    "small"
                );


            time.textContent =
                formatTime(
                    comment.createdAt
                );


            content.appendChild(
                author
            );


            content.appendChild(
                text
            );


            content.appendChild(
                time
            );


            // =================================
            // Delete own comment
            // =================================

            if (
                String(
                    comment.userId
                ) ===
                String(
                    USER_ID
                )
            ) {

                const deleteBtn =
                    document.createElement(
                        "button"
                    );


                deleteBtn.type =
                    "button";


                deleteBtn.className =
                    "delete-comment";


                deleteBtn.textContent =
                    "Delete";


                deleteBtn.addEventListener(
                    "click",
                    () => {

                        deleteComment(
                            comment.id
                        );

                    }
                );


                content.appendChild(
                    deleteBtn
                );

            }


            item.appendChild(
                avatar
            );


            item.appendChild(
                content
            );


            commentsList.appendChild(
                item
            );

        }
    );

}


// ==========================================
// ADD COMMENT
// ==========================================

async function addComment() {

    if (!currentVideo) {

        return;

    }


    if (!commentInput) {

        return;

    }


    const text =
        commentInput.value.trim();


    if (!text) {

        showToast(
            "Write a comment first"
        );

        return;

    }


    try {

        if (sendCommentBtn) {

            sendCommentBtn.disabled =
                true;

        }


        const result =
            await apiFetch(
                "/api/upload/comment/" +
                encodeURIComponent(
                    currentVideo.id
                ),
                {

                    method:
                        "POST",

                    body:
                        JSON.stringify({

                            userId:
                                USER_ID,

                            userName:
                                USER_NAME,

                            text:
                                text

                        })

                }
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Unable to add comment"
            );

        }


        commentInput.value =
            "";


        showToast(
            "Comment added"
        );


        await loadComments();

    }

    catch (error) {

        console.error(
            "Comment Error:",
            error
        );


        showToast(
            "Unable to add comment"
        );

    }

    finally {

        if (sendCommentBtn) {

            sendCommentBtn.disabled =
                false;

        }

    }

}


// ==========================================
// DELETE COMMENT
// ==========================================

async function deleteComment(
    commentId
) {

    if (
        !currentVideo ||
        !commentId
    ) {

        return;

    }


    try {

        const result =
            await apiFetch(
                "/api/upload/comment/" +
                encodeURIComponent(
                    currentVideo.id
                ) +
                "/" +
                encodeURIComponent(
                    commentId
                ),
                {

                    method:
                        "DELETE"

                }
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Unable to delete comment"
            );

        }


        showToast(
            "Comment deleted"
        );


        await loadComments();

    }

    catch (error) {

        console.error(
            "Delete Comment Error:",
            error
        );


        showToast(
            "Unable to delete comment"
        );

    }

}


// ==========================================
// SHARE VIDEO
// ==========================================

async function shareVideo() {

    if (!currentVideo) {

        return;

    }


    const shareUrl =
        window.location.href;


    try {

        if (
            navigator.share
        ) {

            await navigator.share({

                title:
                    currentVideo.caption ||
                    "Bot Pro Video",

                text:
                    "Watch this video on Bot Pro",

                url:
                    shareUrl

            });

        }

        else {

            await navigator.clipboard.writeText(
                shareUrl
            );


            showToast(
                "Video link copied"
            );

        }

    }

    catch (error) {

        if (
            error.name !==
            "AbortError"
        ) {

            console.error(
                "Share Error:",
                error
            );

        }

    }

}


// ==========================================
// COPY LINK
// ==========================================

async function copyVideoLink() {

    try {

        await navigator.clipboard.writeText(
            window.location.href
        );


        showToast(
            "Link copied"
        );

    }

    catch (error) {

        console.error(
            "Copy Link Error:",
            error
        );


        showToast(
            "Unable to copy link"
        );

    }

}
// ==========================================
// BACK BUTTON
// ==========================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            }

            else {

                window.location.href =
                    "home.html";

            }

        }
    );

}


// ==========================================
// MORE MENU
// ==========================================

if (moreBtn && moreMenu) {

    moreBtn.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            moreMenu.classList.toggle(
                "hidden"
            );

        }
    );

}


document.addEventListener(
    "click",
    (event) => {

        if (
            moreMenu &&
            moreBtn &&
            !moreMenu.contains(
                event.target
            ) &&
            !moreBtn.contains(
                event.target
            )
        ) {

            moreMenu.classList.add(
                "hidden"
            );

        }

    }
);


// ==========================================
// LIKE BUTTON
// ==========================================

if (likeBtn) {

    likeBtn.addEventListener(
        "click",
        async () => {

            await toggleLike();

        }
    );

}


// ==========================================
// SAVE BUTTON
// ==========================================

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        async () => {

            await toggleSave();

        }
    );

}


// ==========================================
// SHARE BUTTON
// ==========================================

if (shareBtn) {

    shareBtn.addEventListener(
        "click",
        async () => {

            await shareVideo();

        }
    );

}


// ==========================================
// COMMENT BUTTON
// ==========================================

if (commentBtn) {

    commentBtn.addEventListener(
        "click",
        () => {

            if (commentsSection) {

                commentsSection.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            }


            if (commentInput) {

                setTimeout(
                    () => {

                        commentInput.focus();

                    },
                    400
                );

            }

        }
    );

}


// ==========================================
// SEND COMMENT
// ==========================================

if (sendCommentBtn) {

    sendCommentBtn.addEventListener(
        "click",
        async () => {

            await addComment();

        }
    );

}


// ==========================================
// ENTER TO COMMENT
// ==========================================

if (commentInput) {

    commentInput.addEventListener(
        "keydown",
        async (event) => {

            if (
                event.key ===
                "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                await addComment();

            }

        }
    );

}


// ==========================================
// COPY LINK
// ==========================================

if (copyLinkBtn) {

    copyLinkBtn.addEventListener(
        "click",
        async () => {

            await copyVideoLink();

        }
    );

}


// ==========================================
// REPORT
// ==========================================

if (reportBtn) {

    reportBtn.addEventListener(
        "click",
        () => {

            showToast(
                "Report feature coming soon"
            );

        }
    );

}


// ==========================================
// VIDEO EVENTS
// ==========================================

if (watchVideo) {

    watchVideo.addEventListener(
        "loadeddata",
        () => {

            if (videoLoading) {

                videoLoading.classList.add(
                    "hidden"
                );

            }


            if (videoError) {

                videoError.classList.add(
                    "hidden"
                );

            }

        }
    );


    watchVideo.addEventListener(
        "error",
        () => {

            console.error(
                "❌ Video playback error"
            );


            if (videoLoading) {

                videoLoading.classList.add(
                    "hidden"
                );

            }


            showVideoError(
                "Unable to play this video."
            );

        }
    );

}


// ==========================================
// ESC KEY
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {

            if (moreMenu) {

                moreMenu.classList.add(
                    "hidden"
                );

            }

        }

    }
);


// ==========================================
// PAGE LOAD
// ==========================================

window.addEventListener(
    "load",
    async () => {

        console.log(
            "🚀 Bot Pro Watch Page Loaded"
        );


        console.log(
            "🔐 Waiting for Firebase authentication..."
        );


        try {

            // ==================================
            // Wait for Firebase Auth
            // ==================================

            const user =
                await waitForAuth();


            if (!user) {

                console.error(
                    "❌ User is not logged in."
                );


                showVideoError(
                    "Please login to watch this video."
                );


                return;

            }


            console.log(
                "✅ Firebase user:",
                user.email
            );


            console.log(
                "👤 Firebase UID:",
                user.uid
            );


            console.log(
                "🎬 Loading selected video..."
            );


            await loadVideo();

        }

        catch (error) {

            console.error(
                "❌ Watch Page Error:",
                error
            );


            showVideoError(
                "Unable to load this video."
            );

        }

    }
);


// ==========================================
// CONSOLE
// ==========================================

console.log(
    "✅ Bot Pro Watch Firebase System Ready"
);


console.log(
    "🎬 Watch Page Script Ready"
);


console.log(
    "🔐 Authenticated Watch Page Ready"
);


// ==========================================
// END OF WATCH.JS
// ==========================================
