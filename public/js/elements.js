export const getIncomingCallDialog = (callTypeInfo, acceptCallHandler, rejectCallHandler) => {
    const dialog = document.createElement("div");
    dialog.classList.add('dialog_wrapper');

    const dialogContent = document.createElement("div");
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent);

    const title = document.createElement("p");
    title.classList.add("dialog_title");
    title.innerHTML = `Incoming ${callTypeInfo} Call`;

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("dialog_image_container");
    const image = document.createElement("img");
    image.src = "./utils/images/dialogAvatar.png";
    imageContainer.appendChild(image);

    dialogContent.appendChild(title);
    dialogContent.appendChild(imageContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("dialog_button_container");

    const acceptCallButton = document.createElement("button");
    acceptCallButton.classList.add("dialog_accept_call_button");
    const acceptCallImg = document.createElement("img");
    acceptCallImg.classList.add("dialog_button_image");
    acceptCallImg.src = "./utils/images/acceptCall.png";
    acceptCallButton.appendChild(acceptCallImg);
    acceptCallButton.addEventListener('click', () => acceptCallHandler());
    buttonContainer.appendChild(acceptCallButton);

    const rejectCallButton = document.createElement("button");
    rejectCallButton.classList.add("dialog_reject_call_button");
    const rejectCallImg = document.createElement("img");
    rejectCallImg.classList.add("dialog_button_image");
    rejectCallImg.src = "./utils/images/rejectCall.png";
    rejectCallButton.appendChild(rejectCallImg);
    rejectCallButton.addEventListener('click', () => rejectCallHandler());
    buttonContainer.appendChild(rejectCallButton);

    dialogContent.appendChild(buttonContainer);

    return dialog;
}

export const getCallingDialog = (rejectCallHandler) => {
    const dialog = document.createElement("div");
    dialog.classList.add('dialog_wrapper');

    const dialogContent = document.createElement("div");
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent);

    const title = document.createElement("p");
    title.classList.add("dialog_title");
    title.innerHTML = `Calling`;

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("dialog_image_container");
    const image = document.createElement("img");
    image.src = "./utils/images/dialogAvatar.png";
    imageContainer.appendChild(image);

    dialogContent.appendChild(title);
    dialogContent.appendChild(imageContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("dialog_button_container");

    const hangUpCallButton = document.createElement("button");
    hangUpCallButton.classList.add("dialog_reject_call_button");
    const hangUpCallImg = document.createElement("img");
    hangUpCallImg.classList.add("dialog_button_image");
    hangUpCallImg.src = "./utils/images/rejectCall.png";
    hangUpCallButton.appendChild(hangUpCallImg);
    hangUpCallButton.addEventListener('click', () => rejectCallHandler());
    buttonContainer.appendChild(hangUpCallButton);

    dialogContent.appendChild(buttonContainer);

    return dialog;
}

export const getInfoDialog = (title, description) => {
    const dialog = document.createElement("div");
    dialog.classList.add('dialog_wrapper');

    const dialogContent = document.createElement("div");
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent);

    const titleElement = document.createElement("p");
    titleElement.classList.add("dialog_title");
    titleElement.innerHTML = title;

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("dialog_image_container");
    const image = document.createElement("img");
    image.src = "./utils/images/dialogAvatar.png";
    imageContainer.appendChild(image);

    dialogContent.appendChild(titleElement);
    dialogContent.appendChild(imageContainer);

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("dialog_description");
    descriptionElement.innerHTML = description;
    dialogContent.appendChild(descriptionElement);

    return dialog;
}