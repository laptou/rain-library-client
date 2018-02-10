// tslint:disable:no-console
import * as vue from "av-ts";
import quagga from "quagga";
import Vue from "vue";

@vue.Component
export default class ScannerPage extends Vue
{
    confidence: number = 0;
    isbn: string | null = null;
    prompt: string | null = null;

    @vue.Lifecycle
    mounted()
    {
        const vf = this.$refs.viewfinder as Element;
        quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                locate: false,
                target: vf,
                constraints: {
                    facingMode: "environment",
                    width: vf.clientWidth,
                    height: vf.clientHeight
                }
            },
            decoder: { readers: ["ean_reader"] }
        }, (err: any) =>
            {
                if (err)
                {
                    console.error(err);
                    return;
                }

                quagga.onDetected((result: any) =>
                {
                    if (result.codeResult)
                    {
                        if (this.isbn === result.codeResult.code)
                            this.confidence++;
                        else
                            this.confidence = 0;

                        this.isbn = result.codeResult.code;
                    }

                    if (this.confidence > 10)
                    {
                        this.prompt = "Detected: " + this.isbn;
                        quagga.stop();
                    }
                    else if (this.confidence > 0)
                    {
                        this.prompt = "Stay still.";
                    }
                    else
                    {
                        this.prompt = "Scan an ISBN barcode.";
                    }
                });

                quagga.start();

                this.prompt = "Scan an ISBN barcode.";
            });
    }

    @vue.Lifecycle
    destroyed()
    {
        quagga.stop();
        console.log("Quagga stopped");
    }
}