import undici from "undici";
import * as cheerio from "cheerio";
import { Database } from "./db.js";
import { BoothItem } from "./entity/BoothItem.js";
import { blue, green } from "./kolorist.js";
import { mkdir, open } from "node:fs/promises";
import path from "node:path";

const outputLogs = "./log";
const url = "https://pixivwaengallery.booth.pm/";

const selector = ".js-mount-point-shop-item-card";
const attribute = "data-item";

try {
    const source = await Database.initialize();
    const boothRepository = source.getRepository(BoothItem);
    console.log(await boothRepository.find());

    await mkdir(outputLogs, { recursive: true });

    console.log(blue(`Loading ${url}`));

    const result = await undici.fetch(url);
    console.log(green(`${result.status} ${result.statusText}`));

    const htmlContent = await result.text();

    const htmlOutputFilename = `${new Date().valueOf()}_${
        new URL(url).host
    }.html`;
    open(path.join(outputLogs, htmlOutputFilename), "w").then((handle) => {
        handle.writeFile(htmlContent).catch((err) => console.error(err));
    });

    const $booth = cheerio.load(htmlContent);
    console.log(green(`Finished loading ${url}`));

    $booth(selector).each((i, element) => {
        const shopItemCard = element.attribs;

        if (shopItemCard && shopItemCard[attribute]) {
            const dataItemRaw = shopItemCard[attribute];
            const dataItem = JSON.parse(dataItemRaw);

            const fileName = `${new Date().valueOf()}_${i}_${
                new URL(url).host
            }.json`;

            const filePath = path.join(outputLogs, fileName);

            open(filePath, "w").then((handle) => {
                handle
                    .writeFile(JSON.stringify(dataItem, null, 4))
                    .then(() => console.log(green(`Wrote ${filePath}`)))
                    .catch((reason) => {
                        console.error(reason);
                    });
            });
        }
    });
} catch (error) {
    console.error(error);
}
