const ADODB = require('node-adodb');
const fs = require("fs").promises;
const path = require('path');
const dbs = ["095TH_BG.mdb", "303rd_bg.mdb", "379th_bg.mdb", "384TH_bg.mdb", "389th_bg.mdb", "390TH_BG.MDB", "392ND_BG.MDB", "445th_bg.mdb", "44TH_BG.MDB", "453rd_bg.mdb", "466TH_BG.MDB", "467th_bg.mdb"]

for (const db of dbs) {
    const cleanName = db.toLowerCase().replace(".mdb", "");
    const connection = ADODB.open(`Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${db};`);
    connection
        .schema(20)
        .then(async schema => {
            const tableNames = schema.map(table => table.TABLE_NAME);
            for (const table of tableNames) {
                if (table.substring(0, 3).toLowerCase() === "tbl") {
                    await saveData(table, cleanName, connection)
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
}


async function saveData(tableName, cleanName, connection) {
    connection
        .query(`SELECT *
                FROM ${tableName}`)
        .then(async data => {
            await writeToFile(`${cleanName}/${tableName}.json`, JSON.stringify(data, null, 2));
        })
        .catch(error => {
            console.error(error);
        });
}


async function writeToFile(filePath, content) {
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, {recursive: true});
    await fs.writeFile(filePath, content);
}