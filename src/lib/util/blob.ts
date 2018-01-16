import axios from "axios";
import stackblur from "stackblur-canvas";

export async function colorInfo(image: Blob, width: number, height: number, margin: number = 0.1)
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

    for (let x = 0; x < data.length; x += 4)
    {
        r = data[x];
        g = data[x + 1];
        b = data[x + 2];

        maxRgb = Math.max(Math.max(r, g), b);
        if (maxRgb < 128)
            dark++;
        else
            light++;

        const minRgb = Math.min(Math.min(r, g), b);
        const saturation = (maxRgb - minRgb) / 255;

        averageSaturation -= (averageSaturation - saturation) / ind;
        ind++;
    }

    const diff = ((light - dark) / (width * height));
    return { brightness: diff, saturation: averageSaturation * 2 - 1 };
}

export async function blur(image: Blob, width: number, height: number, radius: number = 8)
{
    const imageBitmap = await createImageBitmap(image, 0, 0, width, height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (ctx == null) throw new Error("no canvas context available");

    ctx.drawImage(imageBitmap, 0, 0);

    stackblur.canvasRGB(canvas, 0, 0, width, height, radius);

    return await new Promise((resolve, reject) =>
    {
        canvas.toBlob(blob =>
        {
            if (blob) resolve(blob);
            else reject(blob);
        });
    });
}

export async function getRemoteURLAsBlob(url: string): Promise<Blob>
{
    const response = await axios.get(url, { responseType: "blob" });
    return response.data;
}

export function getBlobAsDataURL(blob: Blob): Promise<string>
{
    const reader = new FileReader();
    return new Promise((resolve, reject) =>
    {
        reader.onerror = () => reject(reader.error);
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export function getBlobAsObjectURL(blob: Blob)
{
    return URL.createObjectURL(blob);
}
