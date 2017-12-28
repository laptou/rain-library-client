export async function color_info(image : Blob, width: number, height: number, margin: number = 0.1)
{
    const imageBitmap = await createImageBitmap(image, 0, 0, width, height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (ctx == null) throw new Error("no canvas context available");

    ctx.drawImage(imageBitmap, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let r, g, b, maxRgb;
    let light = 0, dark = 0;
    let averageSaturation = 0.5;
    let ind = 1;

    for(let x = 0; x < data.length; x+=4) {
        r = data[x];
        g = data[x+1];
        b = data[x+2];

        maxRgb = Math.max(Math.max(r, g), b);
        if (maxRgb < 128)
            dark++;
        else
            light++;

        let min_rgb = Math.min(Math.min(r, g), b);
        let saturation = (maxRgb - min_rgb) / 255;

        averageSaturation -= (averageSaturation - saturation) / ind;
        ind ++;
    }

    const dl_diff = ((light - dark) / (width * height));
    return { brightness: dl_diff, saturation: averageSaturation * 2 - 1 };
}