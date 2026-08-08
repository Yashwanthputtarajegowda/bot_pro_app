// ==========================================
// Bot Pro Upload JS
// PART 1 / 3
// Firebase Auth + Video/Photo Upload
// ==========================================

// ==========================================
// Firebase API Helper
// ==========================================

import { apiFetch, waitForAuth } from "./api.js";


// ==========================================
// Backend API
// ==========================================

const API_URL =
    "https://bot-pro-backend-production.up.railway.app";


// ==========================================
// Check Login
// ==========================================

const currentUser =
    await waitForAuth();

if (!currentUser) {

    alert(
        "Please login before uploading."
    );

    window.location.href =
        "login.html";

    throw new Error(
        "User is not logged in."
    );
}


// ==========================================
// File Inputs
// ==========================================

const fileInput =
    document.createElement("input");

fileInput.type =
    "file";

fileInput.accept =
    "video/*,image/*";

fileInput.style.display =
    "none";

document.body.appendChild(
    fileInput
);


const thumbnailInput =
    document.createElement("input");

thumbnailInput.type =
    "file";

thumbnailInput.accept =
    "image/*";

thumbnailInput.style.display =
    "none";

document.body.appendChild(
    thumbnailInput
);


// ==========================================
// Selected Files
// ==========================================

let selectedFile =
    null;

let selectedThumbnail =
    null;

let selectedUploadType =
    "video";


// ==========================================
// Main Elements
// ==========================================

const uploadTypes =
    document.querySelectorAll(
        ".type-card"
    );


const chooseFileBtn =
    document.querySelector(
        ".select-btn"
    );


const uploadTitle =
    document.querySelector(
        ".upload-select h3"
    );


const uploadDescription =
    document.querySelector(
        ".upload-select p"
    );


const videoChooseArea =
    document.querySelector(
        "#videoChooseArea"
    );


const videoPreviewArea =
    document.querySelector(
        "#videoPreviewArea"
    );


const videoPreview =
    document.querySelector(
        "#videoPreview"
    );


const videoFileName =
    document.querySelector(
        "#videoFileName"
    );


const videoCancelBtn =
    document.querySelector(
        "#videoCancelBtn"
    );


const thumbnailButton =
    document.querySelector(
        ".thumb-upload"
    );


const thumbnailText =
    document.querySelector(
        "#thumbnailText"
    );


const thumbnailImage =
    document.querySelector(
        "#thumbnailImage"
    );


const thumbnailCancelBtn =
    document.querySelector(
        "#thumbnailCancelBtn"
    );


const uploadButton =
    document.querySelector(
        ".upload-btn"
    );


const progressFill =
    document.querySelector(
        ".progress-fill"
    );


const progressText =
    document.querySelector(
        "#progressText"
    );


const category =
    document.querySelector(
        ".category-select"
    );


const linkInput =
    document.querySelector(
        ".link-input"
    );


const tagsInput =
    document.querySelector(
        ".tags-input"
    );


const backButton =
    document.querySelector(
        ".back-btn"
    );


// ==========================================
// Upload Settings
// ==========================================

const uploadSettingsBtn =
    document.querySelector(
        "#uploadSettingsBtn"
    );


const uploadSettingsPanel =
    document.querySelector(
        "#uploadSettingsPanel"
    );


const uploadSettingsClose =
    document.querySelector(
        "#uploadSettingsClose"
    );


const saveUploadSettings =
    document.querySelector(
        "#saveUploadSettings"
    );


const uploadQuality =
    document.querySelector(
        "#uploadQuality"
    );


const defaultPrivacy =
    document.querySelector(
        "#defaultPrivacy"
    );


const defaultComments =
    document.querySelector(
        "#defaultComments"
    );


const customThumbnailSetting =
    document.querySelector(
        "#customThumbnailSetting"
    );


// ==========================================
// Upload Type Selection
// ==========================================

uploadTypes.forEach(
    (card) => {

        card.addEventListener(
            "click",
            () => {

                uploadTypes.forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                card.classList.add(
                    "active"
                );


                const type =
                    card
                        .querySelector(
                            "span"
                        )
                        ?.textContent
                        ?.trim();


                // ==============================
                // VIDEO
                // ==============================

                if (
                    type === "Video"
                ) {

                    selectedUploadType =
                        "video";

                    uploadTitle.textContent =
                        "Select Video";

                    uploadDescription.textContent =
                        "MP4 • MOV • AVI • Max 2GB";

                    fileInput.accept =
                        "video/*";

                    resetMainFile();

                }


                // ==============================
                // REEL
                // ==============================

                else if (
                    type === "Reel"
                ) {

                    selectedUploadType =
                        "reel";

                    uploadTitle.textContent =
                        "Select Reel";

                    uploadDescription.textContent =
                        "MP4 • MOV • Max 2GB";

                    fileInput.accept =
                        "video/*";

                    resetMainFile();

                }


                // ==============================
                // LINK
                // ==============================

                else if (
                    type === "Link"
                ) {

                    selectedUploadType =
                        "link";

                    uploadTitle.textContent =
                        "Select File";

                    uploadDescription.textContent =
                        "Choose a video or image";

                    fileInput.accept =
                        "video/*,image/*";

                    resetMainFile();

                }

            }
        );

    }
);


// ==========================================
// Choose Main File
// ==========================================

if (chooseFileBtn) {

    chooseFileBtn.addEventListener(
        "click",
        () => {

            fileInput.click();

        }
    );

}
// ==========================================
// Main File Selected
// ==========================================

fileInput.addEventListener(
    "change",
    () => {

        if (
            !fileInput.files.length
        ) {

            return;

        }


        const file =
            fileInput.files[0];


        selectedFile =
            file;


        console.log(
            "📁 Selected file:",
            file.name
        );


        console.log(
            "📦 File type:",
            file.type
        );


        console.log(
            "📏 File size:",
            (
                file.size /
                (1024 * 1024)
            ).toFixed(2),
            "MB"
        );


        // ==================================
        // VIDEO PREVIEW
        // ==================================

        if (
            file.type.startsWith(
                "video/"
            )
        ) {

            if (videoPreview) {

                videoPreview.src =
                    URL.createObjectURL(
                        file
                    );

                videoPreview.style.display =
                    "block";

            }


            if (videoPreviewArea) {

                videoPreviewArea.style.display =
                    "block";

            }


            if (videoChooseArea) {

                videoChooseArea.style.display =
                    "none";

            }


            if (videoFileName) {

                videoFileName.textContent =
                    file.name;

            }

        }


        // ==================================
        // IMAGE PREVIEW
        // ==================================

        else if (
            file.type.startsWith(
                "image/"
            )
        ) {

            if (thumbnailImage) {

                thumbnailImage.src =
                    URL.createObjectURL(
                        file
                    );

                thumbnailImage.style.display =
                    "block";

            }


            if (thumbnailText) {

                thumbnailText.style.display =
                    "none";

            }

        }

    }
);


// ==========================================
// Reset Main File
// ==========================================

function resetMainFile() {

    selectedFile =
        null;


    fileInput.value =
        "";


    if (videoPreview) {

        videoPreview.pause();

        videoPreview.removeAttribute(
            "src"
        );

        videoPreview.load();

        videoPreview.style.display =
            "none";

    }


    if (videoPreviewArea) {

        videoPreviewArea.style.display =
            "none";

    }


    if (videoChooseArea) {

        videoChooseArea.style.display =
            "";

    }


    if (videoFileName) {

        videoFileName.textContent =
            "";

    }

}


// ==========================================
// Cancel Video
// ==========================================

if (videoCancelBtn) {

    videoCancelBtn.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            resetMainFile();

        }
    );

}


// ==========================================
// Thumbnail Button
// ==========================================

if (thumbnailButton) {

    thumbnailButton.addEventListener(
        "click",
        () => {

            thumbnailInput.click();

        }
    );

}


// ==========================================
// Thumbnail Selected
// ==========================================

thumbnailInput.addEventListener(
    "change",
    () => {

        if (
            !thumbnailInput.files.length
        ) {

            return;

        }


        const file =
            thumbnailInput.files[0];


        selectedThumbnail =
            file;


        showThumbnailPreview(
            file
        );

    }
);


// ==========================================
// Show Thumbnail
// ==========================================

function showThumbnailPreview(
    file
) {

    const imageURL =
        URL.createObjectURL(
            file
        );


    if (thumbnailImage) {

        thumbnailImage.src =
            imageURL;

        thumbnailImage.style.display =
            "block";

    }


    if (thumbnailText) {

        thumbnailText.style.display =
            "none";

    }


    if (thumbnailCancelBtn) {

        thumbnailCancelBtn.style.display =
            "flex";

    }


    console.log(
        "🖼️ Thumbnail selected:",
        file.name
    );

}


// ==========================================
// Reset Thumbnail
// ==========================================

function resetThumbnail() {

    selectedThumbnail =
        null;


    thumbnailInput.value =
        "";


    if (thumbnailImage) {

        thumbnailImage.src =
            "";

        thumbnailImage.style.display =
            "none";

    }


    if (thumbnailText) {

        thumbnailText.style.display =
            "block";

    }


    if (thumbnailCancelBtn) {

        thumbnailCancelBtn.style.display =
            "none";

    }

}


// ==========================================
// Cancel Thumbnail
// ==========================================

if (thumbnailCancelBtn) {

    thumbnailCancelBtn.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            resetThumbnail();

        }
    );

}


// ==========================================
// Progress
// ==========================================

function setProgress(
    value
) {

    const safeValue =
        Math.max(
            0,
            Math.min(
                100,
                Number(value) || 0
            )
        );


    if (progressFill) {

        progressFill.style.width =
            safeValue + "%";

    }


    if (progressText) {

        progressText.textContent =
            Math.round(
                safeValue
            ) + "%";

    }

}


// ==========================================
// Upload Settings
// ==========================================

if (uploadSettingsBtn) {

    uploadSettingsBtn.addEventListener(
        "click",
        () => {

            if (uploadSettingsPanel) {

                uploadSettingsPanel.classList.toggle(
                    "hidden"
                );

            }

        }
    );

}


if (uploadSettingsClose) {

    uploadSettingsClose.addEventListener(
        "click",
        () => {

            if (uploadSettingsPanel) {

                uploadSettingsPanel.classList.add(
                    "hidden"
                );

            }

        }
    );

}


if (saveUploadSettings) {

    saveUploadSettings.addEventListener(
        "click",
        () => {

            const settings = {

                quality:
                    uploadQuality?.value ||
                    "auto",

                privacy:
                    defaultPrivacy?.value ||
                    "public",

                comments:
                    defaultComments?.value ||
                    "on",

                customThumbnail:
                    customThumbnailSetting?.checked ||
                    false

            };


            localStorage.setItem(
                "botpro_upload_settings",
                JSON.stringify(
                    settings
                )
            );


            if (uploadSettingsPanel) {

                uploadSettingsPanel.classList.add(
                    "hidden"
                );

            }


            console.log(
                "⚙️ Upload settings saved:",
                settings
            );

        }
    );

}


// ==========================================
// Back Button
// ==========================================

if (backButton) {

    backButton.addEventListener(
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
// UPLOAD VIDEO / PHOTO
// ==========================================

if (uploadButton) {

    uploadButton.addEventListener(
        "click",
        async () => {

            // ==================================
            // Check Login Again
            // ==================================

            const user =
                await waitForAuth();


            if (!user) {

                alert(
                    "Please login before uploading."
                );

                return;

            }


            // ==================================
            // Check File
            // ==================================

            if (!selectedFile) {

                alert(
                    "Please select a video or photo first."
                );

                return;

            }


            // ==================================
            // File Size
            // ==================================

            const maxSize =
                2 * 1024 * 1024 * 1024;


            if (
                selectedFile.size >
                maxSize
            ) {

                alert(
                    "Maximum file size is 2GB."
                );

                return;

            }


            // ==================================
            // Disable Button
            // ==================================

            uploadButton.disabled =
                true;


            uploadButton.textContent =
                "Uploading...";


            setProgress(
                0
            );


            try {

                // ==================================
                // Form Data
                // ==================================

                const formData =
                    new FormData();


                // ==================================
                // Video / Photo Field
                // ==================================

                if (
                    selectedUploadType ===
                    "photo"
                ) {

                    formData.append(
                        "photo",
                        selectedFile
                    );

                }

                else {

                    formData.append(
                        "video",
                        selectedFile
                    );

                }


                // ==================================
                // Title
                // ==================================

                const titleInput =
                    document.querySelector(
                        ".title-input"
                    );


                if (titleInput) {

                    formData.append(
                        "title",
                        titleInput.value.trim()
                    );

                }


                // ==================================
                // Description
                // ==================================

                const descriptionInput =
                    document.querySelector(
                        ".description-input"
                    );


                if (descriptionInput) {

                    const description =
                        descriptionInput.value.trim();


                    formData.append(
                        "description",
                        description
                    );


                    formData.append(
                        "caption",
                        description
                    );

                }


                // ==================================
                // Category
                // ==================================

                if (category) {

                    formData.append(
                        "category",
                        category.value
                    );

                }


                // ==================================
                // Tags
                // ==================================

                if (tagsInput) {

                    formData.append(
                        "tags",
                        tagsInput.value.trim()
                    );

                }


                // ==================================
                // Upload Type
                // ==================================

                formData.append(
                    "uploadType",
                    selectedUploadType
                );


                // ==================================
                // Thumbnail
                // ==================================

                if (
                    selectedThumbnail
                ) {

                    formData.append(
                        "thumbnail",
                        selectedThumbnail
                    );

                }


                // ==================================
                // Privacy
                // ==================================

                const settingsRaw =
                    localStorage.getItem(
                        "botpro_upload_settings"
                    );


                if (settingsRaw) {

                    try {

                        const settings =
                            JSON.parse(
                                settingsRaw
                            );


                        if (
                            settings.privacy
                        ) {

                            formData.append(
                                "privacy",
                                settings.privacy
                            );

                        }


                        if (
                            settings.comments
                        ) {

                            formData.append(
                                "comments",
                                settings.comments
                            );

                        }

                    }

                    catch (error) {

                        console.log(
                            "Settings parse skipped"
                        );

                    }

                }


                console.log(
                    "🚀 Starting authenticated upload..."
                );


                console.log(
                    "👤 Firebase UID:",
                    user.uid
                );


                console.log(
                    "📁 File:",
                    selectedFile.name
                );


                console.log(
                    "📦 Type:",
                    selectedFile.type
                );


                // ==================================
                // Upload With Firebase Token
                // ==================================

                const token =
                    await user.getIdToken();


                const xhr =
                    new XMLHttpRequest();


                const uploadResult =
                    await new Promise(
                        (
                            resolve,
                            reject
                        ) => {


                            xhr.open(
                                "POST",
                                API_URL +
                                "/api/upload/video"
                            );


                            // ==================================
                            // Firebase Authorization
                            // ==================================

                            xhr.setRequestHeader(
                                "Authorization",
                                "Bearer " +
                                token
                            );


                            // ==================================
                            // Upload Progress
                            // ==================================

                            xhr.upload.addEventListener(
                                "progress",
                                (event) => {

                                    if (
                                        event.lengthComputable
                                    ) {

                                        const percent =
                                            (
                                                event.loaded /
                                                event.total
                                            ) *
                                            100;


                                        setProgress(
                                            percent
                                        );

                                    }

                                }
                            );


                            // ==================================
                            // Upload Complete
                            // ==================================

                            xhr.addEventListener(
                                "load",
                                () => {

                                    let data;


                                    try {

                                        data =
                                            JSON.parse(
                                                xhr.responseText
                                            );

                                    }

                                    catch (
                                        error
                                    ) {

                                        reject(
                                            new Error(
                                                "Invalid server response."
                                            )
                                        );

                                        return;

                                    }


                                    console.log(
                                        "📦 Upload response:",
                                        data
                                    );


                                    if (
                                        xhr.status >= 200 &&
                                        xhr.status < 300
                                    ) {

                                        resolve(
                                            data
                                        );

                                    }

                                    else {

                                        reject(
                                            new Error(
                                                data.error ||
                                                data.message ||
                                                "Upload failed (" +
                                                xhr.status +
                                                ")"
                                            )
                                        );

                                    }

                                }
                            );


                            // ==================================
                            // Network Error
                            // ==================================

                            xhr.addEventListener(
                                "error",
                                () => {

                                    reject(
                                        new Error(
                                            "Network error while uploading."
                                        )
                                    );

                                }
                            );


                            // ==================================
                            // Upload Cancelled
                            // ==================================

                            xhr.addEventListener(
                                "abort",
                                () => {

                                    reject(
                                        new Error(
                                            "Upload cancelled."
                                        )
                                    );

                                }
                            );


                            // ==================================
                            // Send
                            // ==================================

                            xhr.send(
                                formData
                            );

                        }
                    );


                // ==================================
                // Upload Success
                // ==================================

                setProgress(
                    100
                );


                console.log(
                    "✅ Upload successful:",
                    uploadResult
                );


                alert(
                    "Uploaded successfully!"
                );


                // ==================================
                // Go Home
                // ==================================

                window.location.href =
                    "home.html";

            }

            catch (error) {

                console.error(
                    "❌ Upload Error:",
                    error
                );


                alert(
                    error.message ||
                    "Upload failed. Please try again."
                );

            }

            finally {

                uploadButton.disabled =
                    false;


                uploadButton.textContent =
                    "Upload";

            }

        }
    );

}


// ==========================================
// PAGE READY
// ==========================================

console.log(
    "🚀 Bot Pro Upload Page Loaded"
);


console.log(
    "🔐 Firebase authenticated upload ready"
);


// ==========================================
// END OF UPLOAD.JS
// ==========================================
