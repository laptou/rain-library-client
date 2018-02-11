// tslint:disable:no-console
import { Api, Book } from "@lib/api";
import * as vue from "av-ts";
import quagga from "quagga";
import Vue from "vue";

@vue.Component
export default class ScannerPage extends Vue
{
    confidence: number = 0;
    id: string | null = null;
    book: Book | null = null;
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
            decoder: { readers: ["code_39_reader"] }
        },
            (err: any) =>
            {
                if (err)
                {
                    console.error(err);
                    return;
                }

                quagga.onDetected(async (result: any) =>
                {
                    if (result.codeResult)
                    {
                        if (this.id === result.codeResult.code)
                            this.confidence++;
                        else
                            this.confidence = 0;

                        this.id = result.codeResult.code;
                    }

                    if (this.confidence > 10)
                    {
                        this.prompt = "Detected: " + this.id;
                        quagga.stop();

                        this.book = await Api.getBookById(this.id as string);

                        if (!this.book)
                        {
                            quagga.start();
                            this.confidence = 0;
                            this.prompt = "The book could not be found. Try again.";
                        }
                    }
                    else if (this.confidence > 0)
                    {
                        this.prompt = "Stay still.";
                    }
                    else
                    {
                        this.prompt = "Scan an ID barcode.";
                    }
                });

                quagga.start();

                this.prompt = "Scan an ID barcode.";
            });
    }

    @vue.Lifecycle
    destroyed()
    {
        quagga.stop();
        console.log("Quagga stopped");
    }
}