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

    onBlur(ev: FocusEvent)
    {
        quagga.stop();
    }

    onFocus(ev: FocusEvent)
    {
        quagga.start();
    }

    @vue.Lifecycle
    mounted()
    {
        window.addEventListener("blur", this.onBlur);
        window.addEventListener("focus", this.onFocus);

        const vf = this.$refs.viewfinder as Element;

        const constraints: any = {
            facingMode: "environment",
            width: { min: vf.clientWidth },
            height: { min: vf.clientHeight }
        };

        if (navigator.mediaDevices && navigator.mediaDevices.getSupportedConstraints().aspectRatio)
            constraints.aspectRatio = 0.5;

        quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: vf,
                constraints
            },
            decoder: { readers: ["code_93_reader"] }
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
                        else
                        {
                            setTimeout(() =>
                            {
                                if (this.id)
                                    this.$router.push(`/library/book/${this.id.toLowerCase()}`);
                            }, 1000);
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