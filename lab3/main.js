const canvas = document.createElement('canvas');

let path = 'https://source.unsplash.com/collection/190727/';
canvas.width = 600;
canvas.height = 400;
const ctx = canvas.getContext('2d'),

    img1 = new Image(),
    img2 = new Image(),
    img3 = new Image(),
    img4 = new Image(),

    xOffset = 50,
    yOffset = 50;


// чтобы можно было скачать картинку по том по правилам Cross-Origin Resource Sharing
img1.crossOrigin = 'anonymous';
img1.src = path + '350x250';

const data = JSON.parse(getQuote());

img1.onload = function () {
    ctx.drawImage(img1, 0, 0);
    img2.crossOrigin = 'anonymous';
    img2.src = path + '350x150';
    //когда первая картинка готова, рисуем ее и идем за второй и тд
    img2.onload = function () {
        ctx.drawImage(img2, 0, 200 + yOffset);
        img3.crossOrigin = 'anonymous';
        img3.src = path + '250x250';
        img3.onload = function () {
            ctx.drawImage(img3, 300 + xOffset, 0);
            img4.crossOrigin = 'anonymous';
            img4.src = path + '250x150';
            img4.onload = function () {
                ctx.drawImage(img4, 300 + xOffset, 200 + yOffset);
                fillText();
                //прикрепляем созданную канву в документ
                document.body.appendChild(canvas);
            };
        };
    };
};



function wrappedLines(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function fillText() {
    ctx.font = 'Bold 22px Arial';
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const fontSize = 22;
    const textMargin = 5;


    const textLines = wrappedLines(ctx, data[0].quote, 600 * 0.9);
    const linesCount = textLines.length;
    const textHeight = (linesCount * fontSize) + ((linesCount - 1) * textMargin);
    const startY = (400 - textHeight) / 2;
    textLines.forEach((line, i) => {
        const lineY = startY + i * (fontSize + textMargin);
        ctx.fillText(line, 300, lineY);
    });
    ctx.fillText('(c) ' + data[0].character, 450, 370);
}

//вызывается по клику на канве
canvas.onclick = function () {
    let dataURL = canvas.toDataURL("image/jpeg");
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.href = dataURL;
    link.download = "q.jpg";
    link.click();
    document.body.removeChild(link);
};

function getQuote() {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://thesimpsonsquoteapi.glitch.me/quotes', false);
    xhr.send();
    return xhr.responseText;

}