import { Database } from "./db.js";
import { BoothItem } from "./entity/BoothItem.js";

try {
    const source = await Database.initialize();

    const item = new BoothItem();
    item.id = 452754;
    item.name = "Testing Item";

    const itemRepo = source.getRepository(BoothItem);
    itemRepo.save(item);

} catch (error) {
    console.error(error);
}
